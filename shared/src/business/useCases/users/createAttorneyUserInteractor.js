const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * createAttorneyUserInteractor
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context
 * @param {Object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
exports.createAttorneyUserInteractor = async ({ applicationContext, user }) => {
  const requestUser = applicationContext.getCurrentUser();
  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.MANAGE_ATTORNEY_USERS)) {
    throw new UnauthorizedError('Unauthorized for creating attorney user');
  }

  const createdUser = await applicationContext
    .getPersistenceGateway()
    .createAttorneyUser({
      applicationContext,
      user,
    });

  return new User(createdUser, { applicationContext }).validate().toRawObject();
};
