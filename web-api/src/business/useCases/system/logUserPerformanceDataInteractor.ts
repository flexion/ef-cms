import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';

export const logUserPerformanceDataInteractor = async (
  applicationContext: ServerApplicationContext,
  performanceData: {
    sequenceName: string;
    duration: number;
    actionPerformanceArray: { actionName: string; duration: number }[];
  },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthUser(authorizedUser)) return;

  const { email } = authorizedUser;
  await applicationContext.getPersistenceGateway().saveSystemPerformanceData({
    applicationContext,
    performanceData: {
      ...performanceData,
      email,
    },
  });
};
