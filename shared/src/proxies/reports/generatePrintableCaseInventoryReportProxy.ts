import { ClientApplicationContext } from '@web-client/applicationContext';
import { asyncSyncHandler, get } from '../requests';

interface PrintableCaseInventoryReportResult {
  fileId: string;
  url: string;
}

/**
 * generatePrintableCaseInventoryReportInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.associatedJudge the judge to filter by
 * @param {string} providers.status the status to filter by
 * @returns {Promise<PrintableCaseInventoryReportResult>} the promise of the api call
 */
export const generatePrintableCaseInventoryReportInteractor = (
  applicationContext: ClientApplicationContext,
  {
    associatedJudge,
    status,
  }: {
    associatedJudge?: string;
    status?: string;
  },
): Promise<PrintableCaseInventoryReportResult> => {
  return asyncSyncHandler<PrintableCaseInventoryReportResult>(
    applicationContext,
    async (asyncSyncId: string) =>
      await get({
        applicationContext,
        asyncSyncId,
        endpoint: '/async/reports/printable-case-inventory-report',
        params: { associatedJudge, status },
      }),
  );
};
