import { state } from 'cerebral';
import { sum, sumBy } from 'lodash';

export const judgeActivityReportHelper = (get, applicationContext) => {
  const { endDate, judgeName, startDate } = get(state.form);

  const {
    casesClosedByJudge,
    opinions,
    orders,
    submittedAndCavCasesByJudge = [],
    trialSessions,
  } = get(state.judgeActivityReportData);

  let closedCasesTotal: number = 0,
    trialSessionsHeldTotal: number = 0,
    opinionsFiledTotal: number = 0,
    ordersFiledTotal: number = 0,
    resultsCount: number = 0,
    showSelectDateRangeText: boolean = false;

  const hasFormBeenSubmitted: boolean =
    casesClosedByJudge && opinions && orders && trialSessions;

  if (hasFormBeenSubmitted) {
    closedCasesTotal = sum(Object.values(casesClosedByJudge));

    trialSessionsHeldTotal = sum(Object.values(trialSessions));

    opinionsFiledTotal = sumBy(
      opinions,
      ({ count }: { count: number }) => count,
    );

    ordersFiledTotal = sumBy(orders, ({ count }: { count: number }) => count);

    resultsCount =
      ordersFiledTotal +
      opinionsFiledTotal +
      trialSessionsHeldTotal +
      closedCasesTotal;
  } else {
    showSelectDateRangeText = true;
  }

  const currentDate: string = applicationContext
    .getUtilities()
    .formatDateString(
      applicationContext.getUtilities().prepareDateFromString(),
      applicationContext.getConstants().DATE_FORMATS.MMDDYY,
    );

  const reportHeader: string = `${judgeName} ${currentDate}`;

  const casesCount = new Map();
  let filteredSubmittedAndCavCasesByJudge: any = [];

  console.log('submittedAndCavCasesByJudge', submittedAndCavCasesByJudge);

  submittedAndCavCasesByJudge.forEach(individualCase => {
    if (individualCase.leadDocketNumber) {
      if (!casesCount.has(individualCase.leadDocketNumber)) {
        casesCount.set(individualCase.leadDocketNumber, 1);
      } else {
        casesCount.set(
          individualCase.leadDocketNumber,
          casesCount.get(individualCase.leadDocketNumber) + 1,
        );
      }
    } else {
      casesCount.set(individualCase.docketNumber, 1);
      filteredSubmittedAndCavCasesByJudge.push(individualCase);
    }

    if (individualCase.docketNumber === individualCase.leadDocketNumber) {
      filteredSubmittedAndCavCasesByJudge.push(individualCase);
    }
  });
  const currentDateInIsoFormat: string = applicationContext
    .getUtilities()
    .prepareDateFromString()
    .toISOString();

  filteredSubmittedAndCavCasesByJudge.forEach(filteredCase => {
    filteredCase.formattedCaseCount = casesCount.get(filteredCase.docketNumber);
    if (filteredCase.leadDocketNumber === filteredCase.docketNumber) {
      filteredCase.consolidatedIconTooltipText = 'Lead case';
      filteredCase.isLeadCase = true;
      filteredCase.inConsolidatedGroup = true;
    }

    filteredCase.caseStatusHistory.sort((a, b) => a.date - b.date);

    const newestCaseStatusChangeIndex =
      filteredCase.caseStatusHistory.length - 1;

    const dateOfLastCaseStatusChange =
      filteredCase.caseStatusHistory[newestCaseStatusChangeIndex].date;

    filteredCase.daysElapsedSinceLastStatusChange = applicationContext
      .getUtilities()
      .calculateDifferenceInDays(
        currentDateInIsoFormat,
        dateOfLastCaseStatusChange,
      );
  });

  return {
    closedCasesTotal,
    filteredSubmittedAndCavCasesByJudge,
    isFormPristine: !endDate || !startDate,
    opinionsFiledTotal,
    ordersFiledTotal,
    progressDescriptionTableTotal: filteredSubmittedAndCavCasesByJudge.length,
    reportHeader,
    showResultsTables: resultsCount > 0,
    showSelectDateRangeText,
    trialSessionsHeldTotal,
  };
};
