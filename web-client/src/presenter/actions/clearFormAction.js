import { state } from 'cerebral';

/**
 * resets the state.form which is used throughout the app for storing html form values
 * state.form is used throughout the app for storing html form values
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for clearing the form
 */
export const clearFormAction = ({ store }) => {
  store.set(state.form, {});
  store.set(state.screenMetadata, {});
};
