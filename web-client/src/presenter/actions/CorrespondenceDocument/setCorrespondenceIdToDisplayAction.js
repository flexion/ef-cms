import { state } from 'cerebral';

/**
 * sets the correspondence document onto the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @param {Function} providers.get the cerebral get helper function
 * @returns {Promise} async action
 */
export const setCorrespondenceIdToDisplayAction = async ({ props, store }) => {
  store.set(state.correspondenceDocumentId, props.correspondenceId);
};
