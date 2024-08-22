import {
  AUTOMATIC_BLOCKED_REASONS,
  AutomaticBlockedReasons,
  CASE_STATUS_TYPES,
  CaseStatus,
} from '@shared/business/entities/EntityConstants';

type SelectCriteriaHelperResults = {
  automaticBlockedReasons: {
    key: string;
    value: AutomaticBlockedReasons | 'Manual Block';
  }[];
  caseStatuses: { key: string; value: CaseStatus }[];
};

export const selectCriteriaHelperInternal = (): SelectCriteriaHelperResults => {
  const automaticBlockedReasons: {
    key: string;
    value: AutomaticBlockedReasons | 'Manual Block';
  }[] = Object.entries(AUTOMATIC_BLOCKED_REASONS).map(([key, value]) => ({
    key,
    value,
  }));

  automaticBlockedReasons.push({
    key: 'manualBlock',
    value: 'Manual Block',
  });

  const caseStatuses: { key: string; value: CaseStatus }[] = Object.entries(
    CASE_STATUS_TYPES,
  ).map(([key, value]) => ({
    key,
    value,
  }));

  const sortByLabel = (a, b) => {
    if (a.value < b.value) return -1;
    if (a.value > b.value) return 1;
    return 0;
  };

  return {
    automaticBlockedReasons: automaticBlockedReasons.sort(sortByLabel),
    caseStatuses: caseStatuses.sort(sortByLabel),
  };
};

export const selectCriteriaHelper =
  selectCriteriaHelperInternal as unknown as SelectCriteriaHelperResults;
