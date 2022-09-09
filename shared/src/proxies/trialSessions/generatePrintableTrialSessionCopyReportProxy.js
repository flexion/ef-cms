const { get } = require('../requests');

/**
 * generatePrintableTrialSessionCopyReportInteractorProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the optional trialSessionId filter
 * @returns {Promise<*>} the promise of the api call
 */
exports.generatePrintableTrialSessionCopyReportInteractor = (
  applicationContext,
  { formattedTrialSession, trialSessionId },
) => {
  return get({
    applicationContext,
    body: {
      formattedTrialSession,
    },
    endpoint: `/trial-sessions/${trialSessionId}/printable-working-copy`,
  });
};
