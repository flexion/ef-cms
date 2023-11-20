import {
  GetCustomCaseReportRequest,
  GetCustomCaseReportResponse,
} from '@web-api/business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
import { get } from '../requests';
import { trpcClient } from '@web-client/trpc-client';

export const getCustomCaseReportInteractor = (
  applicationContext,
  filters: GetCustomCaseReportRequest,
): Promise<GetCustomCaseReportResponse> => {
  // return get({
  //   applicationContext,
  //   endpoint: '/reports/custom-case-report',
  //   params: filters,
  // });

  return trpcClient.customCaseReport.query(filters);
};
