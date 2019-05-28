import { state } from 'cerebral';

/**
 * Cancels a delayed auto log-out
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.get the cerebral get function to retrieve state values
 * @param {Object} providers.store the cerebral store object used for clearing alertError, alertSuccess, caseDetailErrors
 */
export const cancelDelayedLogoutAction = ({ get, store }) => {
  const oldTimer = get(state.logoutTimer);
  clearTimeout(oldTimer);
  store.set(state.logoutTimer, null);
  store.set(state.shouldIdleLogout, false);
};
