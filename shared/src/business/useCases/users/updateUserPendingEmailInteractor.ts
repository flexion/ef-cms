import { Practitioner, RawPractitioner } from '../../entities/Practitioner';
import { ROLES } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { RawUser, User } from '../../entities/User';
import { UnauthorizedError } from '@web-api/errors/errors';

export const updateUserPendingEmailInteractor = async (
  applicationContext: IApplicationContext,
  { pendingEmail }: { pendingEmail: string },
): Promise<RawUser | RawPractitioner> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)) {
    throw new UnauthorizedError('Unauthorized to manage emails.');
  }

  const isEmailAvailable = await applicationContext
    .getUserGateway()
    .isEmailAvailable(applicationContext, {
      email: pendingEmail,
    });

  if (!isEmailAvailable) {
    throw new Error('Email is not available');
  }

  const user: any = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  user.pendingEmail = pendingEmail;

  const pendingEmailVerificationToken = applicationContext.getUniqueId();
  user.pendingEmailVerificationToken = pendingEmailVerificationToken;

  let updatedUserRaw;
  if (user.role === ROLES.petitioner) {
    updatedUserRaw = new User(user).validate().toRawObject();
  } else {
    updatedUserRaw = new Practitioner(user).validate().toRawObject();
  }

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: updatedUserRaw,
  });

  await applicationContext.getUseCaseHelpers().sendEmailVerificationLink({
    applicationContext,
    pendingEmail,
    pendingEmailVerificationToken,
  });

  return updatedUserRaw;
};
