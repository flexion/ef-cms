const { remove } = require('../requests');

/**
 * deleteCorrespondenceDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseId the id of the case that contains the document to delete
 * @param {string} providers.documentIdToDelete the id of the correspondence document
 * @returns {Promise<*>} the promise of the api call
 */
exports.deleteCorrespondenceDocumentInteractor = ({
  applicationContext,
  caseId,
  documentIdToDelete,
}) => {
  return remove({
    applicationContext,
    endpoint: `/case-documents/${caseId}/correspondence/${documentIdToDelete}`,
  });
};
