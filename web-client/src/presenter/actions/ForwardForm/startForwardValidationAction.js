import { state } from 'cerebral';

/**
 * sets the state.workItemMetadata to true to start validation
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.workItemMetadata
 */
export const startForwardValidationAction = ({ store }) => {
  store.set(state.workItemMetadata.showValidation, true);
};
