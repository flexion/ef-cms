const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * canSetTrialSessionAsCalendaredInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialSession trial session object
 * @returns {boolean} result of the entity method call depicting trial session calendaring eligibility
 */
exports.canSetTrialSessionAsCalendaredInteractor = ({
  applicationContext,
  trialSession,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { TrialSession } = applicationContext.getEntityConstructors();
  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  return trialSessionEntity.canSetAsCalendared();
};
