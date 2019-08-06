const { put } = require('./requests');

/**
 * updateCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {object} providers.caseToUpdate the updated case data
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateCaseInteractor = ({ applicationContext, caseToUpdate }) => {
  return put({
    applicationContext,
    body: caseToUpdate,
    endpoint: `/cases/${caseToUpdate.caseId}`,
  });
};
