const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * getUsersPendingEmailStatusesInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {array} providers.userIds an array of userIds
 * @returns {object} a map of userIds boolean values whether email is pending
 */
exports.getUsersPendingEmailStatusesInteractor = async (
  applicationContext,
  { userIds },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  // FIXME this is broken

  if (
    !isAuthorized(
      authorizedUser,
      ROLE_PERMISSIONS.GET_USER_PENDING_EMAIL_STATUS,
    )
  ) {
    throw new UnauthorizedError("Unauthorized to get users' pending emails");
  }

  const usersRaw = await applicationContext
    .getPersistenceGateway()
    .getUsersById({
      applicationContext,
      userIds,
    });

  if (!usersRaw || !usersRaw.length) return;

  const usersMapping = {};

  usersRaw.forEach(userRaw => {
    const validatedUserRaw = new User(userRaw).validate().toRawObject();

    usersMapping[validatedUserRaw.userId] = !!validatedUserRaw.pendingEmail;
  });

  return usersMapping;
};
