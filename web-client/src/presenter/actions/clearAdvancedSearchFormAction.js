import { state } from 'cerebral';

/**
 * sets the state.advancedSearchForm to page 1
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.users
 * @param {object} providers.props the cerebral props object used for getting the props.users
 */
export const clearAdvancedSearchFormAction = ({ store }) => {
  store.set(state.advancedSearchForm, { currentPage: 1 });
  store.unset(state.searchResults);
};
