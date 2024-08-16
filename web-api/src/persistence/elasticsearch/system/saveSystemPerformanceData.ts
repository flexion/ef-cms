import { ServerApplicationContext } from '@web-api/applicationContext';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { environment } from '@web-api/environment';

type PerformanceMeasurement = {
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
  performanceData: {
    sequenceName: string;
    duration: number;
    actionPerformanceArray: { actionName: string; duration: number }[];
    email: string;
  };
}) => {
  const client = applicationContext.getInfoSearchClient();
  const date = createISODateString();

  const performanceMesurements: PerformanceMeasurement[] = [
    {
      date,
      duration: performanceData.duration,
      environment: environment.stage,
      metricName: performanceData.sequenceName,
    },
    ...performanceData.actionPerformanceArray.map(actionData => ({
      date,
      duration: actionData.duration,
      environment: environment.stage,
      metricName: actionData.actionName,
    })),
  ];

  await Promise.all(
    // TODO 10432: Can we store these with a single call?
    performanceMesurements.map(async measurement => {
      await client.index({
        body: measurement,
        index: 'system-performance-logs',
      });
    }),
  );
};
