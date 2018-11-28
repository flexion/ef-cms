import _ from 'lodash';

import { state } from 'cerebral';

const formatCase = caseRecord => {
  caseRecord.docketNumber = _.trimStart(caseRecord.docketNumber, '0');
  return caseRecord;
};

export const formattedCases = get => {
  const cases = get(state.cases);
  return cases.map(formatCase);
};
export const formattedCaseDetail = get => {
  const caseRecord = get(state.caseDetail);
  return formatCase(caseRecord);
};
export const formattedSearchParams = get => {
  let searchTerm = get(state.searchTerm);
  searchTerm = _.padStart(searchTerm, 8, '0');
  return searchTerm;
};
