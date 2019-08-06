const {
  GET_USERS_IN_SECTION,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
/**
 * getUsersInSectionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.section the section to get the users
 * @returns {Promise} the promise of the getUsersInSection call
 */
exports.getUsersInSectionInteractor = ({ applicationContext, section }) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, GET_USERS_IN_SECTION)) {
    throw new UnauthorizedError('Unauthorized');
  }
  return applicationContext.getPersistenceGateway().getUsersInSection({
    applicationContext,
    section,
  });
};
