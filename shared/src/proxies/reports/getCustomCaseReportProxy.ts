import { trpcClient } from '@web-client/trpc-client';

export const getCustomCaseReportInteractor =
  trpcClient.getCustomCaseReportInteractor.query;
