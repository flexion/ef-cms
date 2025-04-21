import { DOCKET_NUMBER_SUFFIXES } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const trimDocketNumberSearch = (searchTerm: string = ''): string => {
  if (searchTerm === '') {
    return '';
  }

  const suffixes = Object.values(DOCKET_NUMBER_SUFFIXES).join('|');
  const docketNumberMatcher = new RegExp(
    `^(\\d{3,6}-\\d{2})(${suffixes})?$`,
    'i',
  );

  const match = docketNumberMatcher.exec(searchTerm.trim());
  const docketNumber = match && match.length > 1 ? match[1] : searchTerm;
  return docketNumber;
};

/**
 * sets the docket number from the search form in props
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function used for getting state.header.searchTerm
 * @returns {object} the docketNumber provided in the search term
 */
export const setDocketNumberFromSearchAction = ({ get }: ActionProps) => {
  const searchTerm = get(state.header.searchTerm);
  const docketNumber = trimDocketNumberSearch(searchTerm);
  return {
    docketNumber,
  };
};
