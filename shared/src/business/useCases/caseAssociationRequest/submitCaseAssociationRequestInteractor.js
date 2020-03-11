const {
  associateIrsPractitionerToCase,
} = require('../../useCaseHelper/caseAssociation/associateIrsPractitionerToCase');
const {
  associatePrivatePractitionerToCase,
} = require('../../useCaseHelper/caseAssociation/associatePrivatePractitionerToCase');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * submitCaseAssociationRequestInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id
 * @param {string} providers.representingPrimary true if the user is representing
 * the primary contact on the case, false otherwise
 * @param {string} providers.representingSecondary true if the user is representing
 * the secondary contact on the case, false otherwise
 * @returns {Promise<*>} the promise of the case association request
 */
exports.submitCaseAssociationRequestInteractor = async ({
  applicationContext,
  caseId,
  representingPrimary,
  representingSecondary,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.ASSOCIATE_SELF_WITH_CASE)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const isPractitioner = authorizedUser.role === User.ROLES.privatePractitioner;
  const isRespondent = authorizedUser.role === User.ROLES.irsPractitioner;

  if (isPractitioner) {
    return await associatePrivatePractitionerToCase({
      applicationContext,
      caseId,
      representingPrimary,
      representingSecondary,
      user,
    });
  } else if (isRespondent) {
    return await associateIrsPractitionerToCase({
      applicationContext,
      caseId,
      user,
    });
  }
};
