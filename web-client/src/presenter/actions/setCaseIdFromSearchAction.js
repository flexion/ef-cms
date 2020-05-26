import { state } from 'cerebral';
const docketNumberMatcher = /^(\d{3,5}-\d{2})[XPRWSL]?L?(.*)$/i;

export const trimDocketNumberSearch = searchTerm => {
  const match = docketNumberMatcher.exec(searchTerm.trim());
  const docketNumber =
    match && match.length > 1 && match[2] === '' ? match[1] : searchTerm;
  return docketNumber;
};

/**
 * sets the state.caseId based on what the search term in the input box was
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function used for getting state.header.searchTerm
 * @param {object} providers.store the cerebral store used for setting the state.caseId
 * @returns {object} the caseId set to the docketNumber provided in the search term
 */
export const setCaseIdFromSearchAction = ({ get, store }) => {
  const searchTerm = get(state.header.searchTerm);
  const docketNumber = trimDocketNumberSearch(searchTerm);
  store.set(state.caseId, docketNumber);
  return {
    caseId: docketNumber,
  };
};
