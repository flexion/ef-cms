import { state } from 'cerebral';

/**
 * Fetches the case un-sign the getCase use case using the props.docketNumber
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.user.token
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @returns {object} contains the caseDetail returned from the use case
 */
export const getNotificationsAction = async ({ applicationContext, get }) => {
  const judgeUser = get(state.judgeUser);

  const notifications = await applicationContext
    .getUseCases()
    .getNotificationsInteractor({
      applicationContext,
      judgeUser,
    });

  return { notifications };
};
