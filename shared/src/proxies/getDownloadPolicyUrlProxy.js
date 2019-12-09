const { get } = require('./requests');

/**
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case containing the document
 * @param {string} providers.documentId the document id to get
 * @returns {Promise<*>} the promise of the api call
 */
exports.getDownloadPolicyUrl = ({ applicationContext, caseId, documentId }) => {
  return get({
    applicationContext,
    endpoint: `/case-documents/${caseId}/${documentId}/download-policy-url`,
  });
};
