import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '../../../../../shared/src/business/entities/User';

/**
 * getUserPendingEmailInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.userId the userId
 * @returns {Promise} the user's pending email
 */
export const getUserPendingEmailStatusInteractor = async (
  applicationContext: ServerApplicationContext,
  { userId }: { userId: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (
    !isAuthorized(
      authorizedUser,
      ROLE_PERMISSIONS.GET_USER_PENDING_EMAIL_STATUS,
    )
  ) {
    throw new UnauthorizedError(
      'Unauthorized to get user pending email status',
    );
  }

  const userRaw = await applicationContext.getPersistenceGateway().getUserById({
    applicationContext,
    userId,
  });

  if (!userRaw) return;

  const validatedUserRaw = new User(userRaw).validate().toRawObject();

  return !!validatedUserRaw.pendingEmail;
};
