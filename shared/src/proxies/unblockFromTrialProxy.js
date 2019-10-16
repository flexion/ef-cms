const { remove } = require('./requests');

/**
 * unblockFromTrialInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @returns {Promise<*>} the promise of the api call
 */
exports.unblockFromTrialInteractor = ({ applicationContext, caseId }) => {
  return remove({
    applicationContext,
    body: {},
    endpoint: `/cases/${caseId}/block`,
  });
};
