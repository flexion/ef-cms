const { post } = require('../requests');

/**
 * createCoverSheetInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id
 * @param {string} providers.documentId the document id
 * @returns {Promise<*>} the promise of the api call
 */
exports.createCoverSheetInteractor = ({
  applicationContext,
  caseId,
  documentId,
}) => {
  return post({
    applicationContext,
    endpoint: `/cases/${caseId}/documents/${documentId}/coversheet`,
  });
};
