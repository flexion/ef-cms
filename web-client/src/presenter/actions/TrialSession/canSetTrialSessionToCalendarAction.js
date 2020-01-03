import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * create a trial session
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the next object in the path
 * @returns {Promise<object>} the next path based on if creation was successful or error
 */
export const canSetTrialSessionToCalendarAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const { TrialSession } = applicationContext.getEntityConstructors();
  const trialSessionEntity = new TrialSession(get(state.trialSession), {
    applicationContext,
  });

  if (trialSessionEntity.canSetAsCalendared()) {
    return path.yes();
  }

  return path.no({
    alertWarning: {
      message:
        'You must provide an address and judge to be able to set this trial session ',
      title: 'This trial session requires additional information',
    },
  });
};
