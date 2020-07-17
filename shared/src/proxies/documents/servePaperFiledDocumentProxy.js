const { post } = require('../requests');

/**
 * servePaperFiledDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.documentId the id of the document to validate
 * @param {string} providers.caseId the id of the document to validate
 * @returns {Promise<*>} the promise of the api call
 */
exports.servePaperFiledDocumentInteractor = ({
  applicationContext,
  caseId,
  documentId,
}) => {
  return post({
    applicationContext,
    endpoint: `/case-documents/${caseId}/${documentId}/serve`,
  });
};
