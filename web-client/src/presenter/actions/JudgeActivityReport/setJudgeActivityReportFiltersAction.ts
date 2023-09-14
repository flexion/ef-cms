import { state } from 'cerebral';

export const setJudgeActivityReportFiltersAction = ({
  props,
  store,
}: ActionProps) => {
  const filterStartDate: string = props.startDate;
  const filterEndDate: string = props.endDate;
  const selectedJudge: string = props.judgeName;

  if (selectedJudge) {
    store.set(state.judgeActivityReport.filters.judgeName, selectedJudge);
  }
  if (filterStartDate || filterStartDate === '') {
    store.set(state.judgeActivityReport.filters.startDate, filterStartDate);
  }
  if (filterEndDate || filterEndDate === '') {
    store.set(state.judgeActivityReport.filters.endDate, filterEndDate);
  }
};
