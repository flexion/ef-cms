const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getCalendaredCasesForTrialSessionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialSessionId the id of the trial session to get the calendared cases
 * @returns {Promise} the promise of the getCalendaredCasesForTrialSession call
 */
exports.getCalendaredCasesForTrialSessionInteractor = async ({
  applicationContext,
  trialSessionId,
}) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const cases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  return cases.map(caseWithAdditionalProperties => {
    // TODO: revisit this approach.  I think our persistence layer is returning more than it should?
    const {
      disposition,
      isManuallyAdded,
      removedFromTrial,
      removedFromTrialDate,
    } = caseWithAdditionalProperties;

    return {
      ...new Case(caseWithAdditionalProperties, { applicationContext })
        .validate()
        .toRawObject(),
      disposition,
      isManuallyAdded,
      removedFromTrial,
      removedFromTrialDate,
    };
  });
};
