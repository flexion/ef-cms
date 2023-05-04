import { get } from '../requests';

/**
 * batchDownloadTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSession the trial session data
 * @returns {Promise<*>} the promise of the api call
 */
export const batchDownloadTrialSessionInteractor = (
  applicationContext,
  { trialSessionId },
) => {
  return get({
    applicationContext,
    body: {},
    endpoint: `/async/trial-sessions/${trialSessionId}/batch-download`,
  });
};
