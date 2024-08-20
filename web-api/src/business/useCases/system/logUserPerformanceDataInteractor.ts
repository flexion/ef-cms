import { PerformanceMeasurement } from '@web-api/persistence/elasticsearch/system/saveSystemPerformanceData';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { environment } from '@web-api/environment';

export const logUserPerformanceDataInteractor = async (
  applicationContext: ServerApplicationContext,
  performanceData: { [actionName: string]: number[] },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError('Unauthorized to log performance data');
  }

  const date = createISODateString();
  const measurements: PerformanceMeasurement[] = [];
  Object.entries(performanceData).forEach(([actionName, durations]) => {
    durations.forEach(duration => {
      measurements.push({
        date,
        duration,
        environment: environment.stage,
        metricName: actionName,
      });
    });
  });

  await applicationContext.getPersistenceGateway().saveSystemPerformanceData({
    applicationContext,
    performanceData: measurements,
  });
};
