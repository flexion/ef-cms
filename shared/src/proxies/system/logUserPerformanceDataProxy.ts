import { post } from '@shared/proxies/requests';

export const logUserPerformanceDataInteractor = (
  applicationContext,
  performanceData: {
    sequenceName: string;
    duration: number;
    actionPerformanceArray: { actionName: string; duration: number }[];
  },
): Promise<void> => {
  return post({
    applicationContext,
    body: { performanceData },
    endpoint: '/log/performance-data',
  });
};
