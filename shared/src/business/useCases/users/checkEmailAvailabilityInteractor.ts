import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

export const checkEmailAvailabilityInteractor = async (
  applicationContext: IApplicationContext,
  { email }: { email: string },
): Promise<boolean> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)) {
    throw new UnauthorizedError('Unauthorized to manage emails.');
  }

  const isEmailAvailable = await applicationContext
    .getUserGateway()
    .isEmailAvailable(applicationContext, {
      email,
    });

  return isEmailAvailable;
};
