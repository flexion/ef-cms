const {
  FILE_EXTERNAL_DOCUMENT,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.uploadExternalDocumentInteractor = async ({
  applicationContext,
  documentFiles,
  documentMetadata,
  progressFunctions,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, FILE_EXTERNAL_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const uploadedDocumentPromises = [];

  /**
   * uploads a document and then immediately processes it to scan for viruses,
   * validate the PDF content, and sanitize the document.
   *
   * @param {string} documentLabel the string identifying which documentFile and progressFunction
   * @returns {Promise<string>} the documentId returned from a successful upload
   */
  const uploadDocumentAndMakeSafe = async documentLabel => {
    const documentId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: documentFiles[documentLabel],
        onUploadProgress: progressFunctions[documentLabel],
      });
    await applicationContext.getUseCases().virusScanPdfInteractor({
      applicationContext,
      documentId,
    });
    await applicationContext.getUseCases().validatePdfInteractor({
      applicationContext,
      documentId,
    });
    await applicationContext.getUseCases().sanitizePdfInteractor({
      applicationContext,
      documentId,
    });
    return documentId;
  };

  /**
   * @param {string} documentId the id of a document found in storage
   * @returns {Promise<*>} resolves after sequentially scanning, validating, and sanitizing the document
   */

  uploadedDocumentPromises.push(uploadDocumentAndMakeSafe('primary'));

  if (documentFiles.secondary) {
    uploadedDocumentPromises.push(uploadDocumentAndMakeSafe('secondary'));
  }

  if (documentMetadata.hasSupportingDocuments) {
    for (let i = 0; i < documentMetadata.supportingDocuments.length; i++) {
      uploadedDocumentPromises.push(
        uploadDocumentAndMakeSafe(`primarySupporting${i}`),
      );
    }
  }

  if (documentMetadata.hasSecondarySupportingDocuments) {
    for (
      let i = 0;
      i < documentMetadata.secondarySupportingDocuments.length;
      i++
    ) {
      uploadedDocumentPromises.push(
        uploadDocumentAndMakeSafe(`secondarySupporting${i}`),
      );
    }
  }

  if (user.role === 'practitioner' && !documentMetadata.practitioner) {
    documentMetadata.practitioner = [{ ...user, partyPractitioner: true }];
  }

  const documentIds = await Promise.all(uploadedDocumentPromises);

  return await applicationContext.getUseCases().fileExternalDocumentInteractor({
    applicationContext,
    documentIds,
    documentMetadata,
  });
};
