const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * deleteCaseNoteInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case the case note is attached to
 * @returns {Promise} the promise of the delete call
 */
exports.deleteCaseNoteInteractor = async ({ applicationContext, caseId }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return await applicationContext.getPersistenceGateway().deleteCaseNote({
    applicationContext,
    caseId,
    userId: user.userId,
  });
};
