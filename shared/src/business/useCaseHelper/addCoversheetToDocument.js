const { addCoverToPdf } = require('./addCoverToPdf');
const { Case } = require('../entities/cases/Case');

/**
 * addCoversheetToDocument
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id
 * @param {string} providers.documentId the document id
 * @returns {Uint8Array} the new pdf data
 */
exports.addCoversheetToDocument = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseRecord, { applicationContext });

  const documentEntity = caseEntity.documents.find(
    document => document.documentId === documentId,
  );

  const pdfData = await applicationContext.getPersistenceGateway().getDocument({
    applicationContext,
    caseId,
    documentId,
    protocol: 'S3',
  });

  const newPdfData = await addCoverToPdf({
    applicationContext,
    caseEntity,
    documentEntity,
    pdfData,
  });

  documentEntity.setAsProcessingStatusAsCompleted();

  await applicationContext
    .getPersistenceGateway()
    .updateDocumentProcessingStatus({
      applicationContext,
      caseId,
      documentId,
    });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: newPdfData,
    documentId,
  });

  return newPdfData;
};
