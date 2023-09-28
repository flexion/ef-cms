import { FORMATS } from '@shared/business/utilities/DateHandler';
import {
  InvalidRequest,
  UnauthorizedError,
} from '../../../../../web-api/src/errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { SubmittedCAVTableFields } from '@web-api/persistence/elasticsearch/getDocketNumbersByStatusAndByJudge';
import { isEmpty } from 'lodash';

export type JudgeActivityReportCavAndSubmittedCasesRequest = {
  statuses: string[];
  judges: string[];
};

export type CavAndSubmittedFilteredCasesType = SubmittedCAVTableFields & {
  daysElapsedSinceLastStatusChange: number;
  formattedCaseCount: number;
  caseWorksheet: RawCaseWorksheet;
};

export const getCasesByStatusAndByJudgeInteractor = async (
  applicationContext: IApplicationContext,
  params: JudgeActivityReportCavAndSubmittedCasesRequest,
): Promise<{
  cases: CavAndSubmittedFilteredCasesType[];
  totalCount: number;
}> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch(params);
  if (!searchEntity.isValid()) {
    throw new InvalidRequest('Invalid search terms');
  }

  const caseRecords = await getCases(applicationContext, searchEntity);

  const daysElapsedSinceLastStatusChange: number[] = caseRecords.map(
    caseRecord => calculateDaysElapsed(applicationContext, caseRecord),
  );

  const numConsolidatedCases: number[] = await Promise.all(
    caseRecords.map(caseRecord =>
      calculateNumberOfConsolidatedCases(applicationContext, caseRecord),
    ),
  );

  const allCaseResults = caseRecords.map((caseRecord, i) => ({
    ...caseRecord,
    daysElapsedSinceLastStatusChange: daysElapsedSinceLastStatusChange[i],
    formattedCaseCount: numConsolidatedCases[i],
  }));

  allCaseResults.sort((a, b) => {
    return (
      b.daysElapsedSinceLastStatusChange - a.daysElapsedSinceLastStatusChange
    );
  });

  return {
    cases: allCaseResults,
    totalCount: allCaseResults.length,
  };
};

const calculateDaysElapsed = (
  applicationContext: IApplicationContext,
  individualCase: SubmittedCAVTableFields,
): number => {
  if (isEmpty(individualCase.caseStatusHistory)) {
    return 0;
  }

  const currentDateInIsoFormat: string = applicationContext
    .getUtilities()
    .formatDateString(
      applicationContext.getUtilities().prepareDateFromString(),
      FORMATS.ISO,
    );

  individualCase.caseStatusHistory.sort((a, b) => a.date - b.date);

  const newestCaseStatusChangeIndex =
    individualCase.caseStatusHistory.length - 1;

  const dateOfLastCaseStatusChange =
    individualCase.caseStatusHistory[newestCaseStatusChangeIndex].date;

  return applicationContext
    .getUtilities()
    .calculateDifferenceInDays(
      currentDateInIsoFormat,
      dateOfLastCaseStatusChange,
    );
};

const getCases = async (
  applicationContext: IApplicationContext,
  searchEntity: JudgeActivityReportSearch,
) => {
  // first get all cases for the specified judges and statuses
  const allCaseRecords = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByStatusAndByJudge({
      applicationContext,
      params: {
        excludeMemberCases: true,
        judges: searchEntity.judges,
        statuses: searchEntity.statuses,
      },
    });

  // filter out cases with decision documents
  const docketNumbersFilterOut = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersWithServedEventCodes(applicationContext, {
      cases: allCaseRecords,
      eventCodes: ['ODD', 'DEC', 'OAD', 'SDEC'],
    });

  const filteredCaseRecords = allCaseRecords.filter(
    caseInfo =>
      !docketNumbersFilterOut.includes(caseInfo.docketNumber) &&
      caseInfo.caseStatusHistory,
  );

  const completeCaseRecords = await attachCaseWorkSheets(
    applicationContext,
    filteredCaseRecords,
  );

  return completeCaseRecords;
};

const calculateNumberOfConsolidatedCases = async (
  applicationContext: IApplicationContext,
  caseInfo: { leadDocketNumber?: string },
) => {
  if (!caseInfo.leadDocketNumber) {
    return 0;
  }

  return await applicationContext
    .getPersistenceGateway()
    .getCountOfConsolidatedCases({
      applicationContext,
      leadDocketNumber: caseInfo.leadDocketNumber,
    });
};

async function attachCaseWorkSheets(
  applicationContext: IApplicationContext,
  cases: SubmittedCAVTableFields[],
) {
  const caseWorksheets = await applicationContext
    .getPersistenceGateway()
    .getCaseWorksheetsByDocketNumber({
      applicationContext,
      docketNumbers: cases.map(c => c.docketNumber),
    });
  const caseWorksheetMap: Map<string, RawCaseWorksheet> = new Map();
  caseWorksheets.forEach(caseWorksheet =>
    caseWorksheetMap.set(caseWorksheet.docketNumber, caseWorksheet),
  );
  const completeCaseRecords = cases.map(aCase => {
    return {
      ...aCase,
      caseWorksheet: caseWorksheetMap.get(aCase.docketNumber)!,
    };
  });
  return completeCaseRecords;
}
