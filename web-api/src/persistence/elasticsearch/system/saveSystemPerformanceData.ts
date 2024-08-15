import { ServerApplicationContext } from '@web-api/applicationContext';
import { createISODateString } from '@shared/business/utilities/DateHandler';

export const saveSystemPerformanceData = async ({
  applicationContext,
  performanceData,
}: {
  applicationContext: ServerApplicationContext;
  performanceData: {
    sequenceName: string;
    duration: number;
    actionPerformanceArray: { actionName: string; duration: number }[];
    email: string;
  };
}) => {
  const client = applicationContext.getSearchPerformanceClient();
  await client.index({
    body: {
      ...performanceData,
      date: createISODateString(),
    },
    index: 'squence-performance-logs',
  });
};
