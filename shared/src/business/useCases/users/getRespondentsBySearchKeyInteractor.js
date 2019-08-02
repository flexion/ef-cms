const {
  ASSOCIATE_USER_WITH_CASE,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getRespondentsBySearchKeyInteractor
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.searchKey the search string entered by the user
 * @returns {*} the result
 */
exports.getRespondentsBySearchKeyInteractor = async ({
  applicationContext,
  searchKey,
}) => {
  const authenticatedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authenticatedUser, ASSOCIATE_USER_WITH_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return await applicationContext.getPersistenceGateway().getUsersBySearchKey({
    applicationContext,
    searchKey,
    type: 'respondent',
  });
};
