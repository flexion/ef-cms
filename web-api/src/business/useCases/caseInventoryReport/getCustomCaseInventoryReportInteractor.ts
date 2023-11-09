import {
  CaseStatus,
  CaseType,
} from '@shared/business/entities/EntityConstants';
import {
  CustomCaseFilingMethods,
  CustomCaseInventorySearch,
  CustomCaseProcedureTypes,
} from '@shared/business/entities/customCaseInventorySearch/CustomCaseInventorySearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

export type CustomCaseInventoryReportFilters = {
  caseStatuses: CaseStatus[];
  caseTypes: CaseType[];
  endDate: string;
  startDate: string;
  filingMethod: CustomCaseFilingMethods;
  preferredTrialCities: string[];
  highPriority?: boolean;
  procedureType: CustomCaseProcedureTypes;
  judges: string[];
};

export type GetCaseInventoryReportRequest = CustomCaseInventoryReportFilters & {
  pageSize: number;
  searchAfter: {
    receivedAt: number;
    pk: string;
  };
};

export type GetCaseInventoryReportResponse = {
  foundCases: CaseInventory[];
  lastCaseId: { receivedAt: number; pk: string };
  totalCount: number;
};

export type CaseInventory = Pick<
  RawCase,
  | 'associatedJudge'
  | 'isPaper'
  | 'procedureType'
  | 'caseCaption'
  | 'caseType'
  | 'docketNumber'
  | 'leadDocketNumber'
  | 'preferredTrialCity'
  | 'receivedAt'
  | 'status'
  | 'highPriority'
>;

export const getCustomCaseInventoryReportInteractor = async (
  applicationContext: IApplicationContext,
  params: GetCaseInventoryReportRequest,
): Promise<GetCaseInventoryReportResponse> => {
  const authorizedUser = applicationContext.getCurrentUser();
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_INVENTORY_REPORT)) {
    throw new UnauthorizedError('Unauthorized for case inventory report');
  }

  params.caseStatuses = params.caseStatuses || [];
  params.caseTypes = params.caseTypes || [];
  params.judges = params.judges || [];
  params.preferredTrialCities = params.preferredTrialCities || [];

  new CustomCaseInventorySearch(params).validate();

  return await applicationContext.getPersistenceGateway().getCasesByFilters({
    applicationContext,
    params,
  });
};
