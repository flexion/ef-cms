import {
  CavAndSubmittedFilteredCasesType,
  ConsolidatedCasesGroupCountMapResponseType,
} from '@shared/business/useCases/judgeActivityReport/getCasesByStatusAndByJudgeInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const setCavAndSubmittedCasesAction = ({
  props,
  store,
}: ActionProps<{
  consolidatedCasesGroupCountMap: ConsolidatedCasesGroupCountMapResponseType;
  totalCountForSubmittedAndCavCases: number;
  cases: CavAndSubmittedFilteredCasesType[];
}>) => {
  const {
    cases: submittedAndCavCasesByJudge,
    consolidatedCasesGroupCountMap,
    totalCountForSubmittedAndCavCases,
  } = props;

  store.set(
    state.judgeActivityReport.judgeActivityReportData
      .consolidatedCasesGroupCountMap,
    consolidatedCasesGroupCountMap,
  );

  store.set(
    state.judgeActivityReport.judgeActivityReportData
      .submittedAndCavCasesByJudge,
    submittedAndCavCasesByJudge,
  );

  store.set(
    state.judgeActivityReport.judgeActivityReportData
      .totalCountForSubmittedAndCavCases,
    totalCountForSubmittedAndCavCases,
  );
};
