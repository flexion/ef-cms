import { post } from '../requests';

/**
 * createTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSession the trial session data
 * @returns {Promise<*>} the promise of the api call
 */
export const createTrialSessionInteractor = (
  applicationContext,
  { trialSession },
) => {
  return post({
    applicationContext,
    body: trialSession,
    endpoint: '/trial-sessions',
  });
};
