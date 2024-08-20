import { ServerApplicationContext } from '@web-api/applicationContext';

export type PerformanceMeasurement = {
  date: string;
  duration: number;
  metricName: string;
  environment: string;
};

export const saveSystemPerformanceData = async ({
  applicationContext,
  performanceData,
}: {
  applicationContext: ServerApplicationContext;
  performanceData: PerformanceMeasurement[];
}) => {
  const client = applicationContext.getInfoSearchClient();

  await client.bulk({
    body: performanceData,
    index: 'system-performance-logs',
  });
};
