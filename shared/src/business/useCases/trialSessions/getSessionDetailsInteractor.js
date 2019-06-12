const {
  isAuthorized,
  TRIAL_SESSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getTrialSessions
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.getSessionDetails = async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSessions = {};
  // await applicationContext
  //   .getPersistenceGateway()
  //   .getSessionInfo({
  //     applicationContext,
  //   });

  return trialSessions;
};
