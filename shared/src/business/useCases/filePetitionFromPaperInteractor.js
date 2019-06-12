const {
  isAuthorized,
  START_PAPER_CASE,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

exports.filePetitionFromPaper = async ({
  petitionMetadata,
  petitionFile,
  ownershipDisclosureFile,
  stinFile,
  applicationContext,
  ownershipDisclosureUploadProgress,
  petitionUploadProgress,
  stinUploadProgress,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, START_PAPER_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const petitionFileId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      document: petitionFile,
      onUploadProgress: petitionUploadProgress,
    });

  let ownershipDisclosureFileId;
  if (ownershipDisclosureFile) {
    ownershipDisclosureFileId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: ownershipDisclosureFile,
        onUploadProgress: ownershipDisclosureUploadProgress,
      });
  }

  let stinFileId;
  if (stinFile) {
    stinFileId = await applicationContext
      .getPersistenceGateway()
      .uploadDocument({
        applicationContext,
        document: stinFile,
        onUploadProgress: stinUploadProgress,
      });
  }

  const documentIds = [
    ownershipDisclosureFileId,
    petitionFileId,
    stinFileId,
  ].filter(documentId => documentId);

  for (let documentId of documentIds) {
    await applicationContext.getUseCases().virusScanPdf({
      applicationContext,
      documentId,
    });

    await applicationContext.getUseCases().validatePdf({
      applicationContext,
      documentId,
    });

    await applicationContext.getUseCases().sanitizePdf({
      applicationContext,
      documentId,
    });
  }

  return await applicationContext.getUseCases().createCaseFromPaper({
    applicationContext,
    ownershipDisclosureFileId,
    petitionFileId,
    petitionMetadata,
    stinFileId,
  });
};
