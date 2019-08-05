const {
  ASSOCIATE_USER_WITH_CASE,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const {
  associatePractitionerToCase,
} = require('../../useCaseHelper/caseAssociation/associatePractitionerToCase');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * associatePractitionerWithCaseInteractor
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.caseId the case id
 * @param {string} params.userId the user id
 * @returns {*} the result
 */
exports.associatePractitionerWithCaseInteractor = async ({
  applicationContext,
  caseId,
  representingPrimary,
  representingSecondary,
  userId,
}) => {
  const authenticatedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authenticatedUser, ASSOCIATE_USER_WITH_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId });

  return await associatePractitionerToCase({
    applicationContext,
    caseId,
    representingPrimary,
    representingSecondary,
    user,
  });
};
