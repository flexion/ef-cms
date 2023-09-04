import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

type CaseWorksheetTableRow = RawCase & {
  worksheet: RawCaseWorksheet;
  consolidatedIconTooltipText: string;
  isLeadCase: boolean;
  inConsolidatedGroup: boolean;
  formattedCaseCount: number;
  daysElapsedSinceLastStatusChange: number;
  formattedSubmittedCavStatusChangedDate: string;
};

interface ICaseWorksheetsHelper {
  caseWorksheetsFormatted: CaseWorksheetTableRow[];
}

export const caseWorksheetsHelper = (
  get: any,
  applicationContext: IApplicationContext,
): ICaseWorksheetsHelper => {
  const { consolidatedCasesGroupCountMap, submittedAndCavCasesByJudge = [] } =
    get(state.judgeActivityReport.judgeActivityReportData);

  const { worksheets = [] } = get(state.submittedAndCavCases);

  const worksheetsObj: { [docketNumber: string]: RawCaseWorksheet } = {};
  worksheets.forEach(ws => (worksheetsObj[ws.docketNumber] = ws));

  const today = applicationContext
    .getUtilities()
    .formatDateString(
      applicationContext.getUtilities().prepareDateFromString(),
      applicationContext.getConstants().DATE_FORMATS.ISO,
    );

  const getSubmittedOrCAVDate = (
    caseStatusHistory: { updatedCaseStatus: string; date: string }[],
  ): string => {
    const foundDate = caseStatusHistory.find(statusHistory =>
      ['Submitted', 'CAV'].includes(statusHistory.updatedCaseStatus),
    )?.date;
    if (!foundDate) return '';
    return applicationContext
      .getUtilities()
      .formatDateString(
        foundDate,
        applicationContext.getConstants().DATE_FORMATS.MMDDYY,
      );
  };

  const caseWorksheetsFormatted = cloneDeep(
    submittedAndCavCasesByJudge.filter(
      unfilteredCase => unfilteredCase.caseStatusHistory.length > 0,
    ),
  );

  // should we map here instead?
  caseWorksheetsFormatted.forEach(aCase => {
    // TODO: figure out what changed - used to call .get on the object
    aCase.formattedCaseCount =
      consolidatedCasesGroupCountMap[aCase.docketNumber] || 1;
    if (aCase.leadDocketNumber === aCase.docketNumber) {
      aCase.consolidatedIconTooltipText = 'Lead case';
      aCase.isLeadCase = true;
      aCase.inConsolidatedGroup = true;
    }

    if (worksheetsObj[aCase.docketNumber]) {
      aCase.worksheet = worksheetsObj[aCase.docketNumber];
    }

    aCase.formattedSubmittedCavStatusChangedDate = getSubmittedOrCAVDate(
      aCase.caseStatusHistory,
    );

    const newestCaseStatusChangeIndex = aCase.caseStatusHistory.length - 1;

    const dateOfLastCaseStatusChange =
      aCase.caseStatusHistory[newestCaseStatusChangeIndex].date;

    aCase.daysElapsedSinceLastStatusChange = applicationContext
      .getUtilities()
      .calculateDifferenceInDays(today, dateOfLastCaseStatusChange);
  });

  caseWorksheetsFormatted.sort((a, b) => {
    return (
      b.daysElapsedSinceLastStatusChange - a.daysElapsedSinceLastStatusChange
    );
  });

  return {
    caseWorksheetsFormatted,
  };
};
