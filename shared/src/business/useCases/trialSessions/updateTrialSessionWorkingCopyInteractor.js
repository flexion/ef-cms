const {
  isAuthorized,
  TRIAL_SESSION_WORKING_COPY,
} = require('../../../authorization/authorizationClientService');
const {
  TrialSessionWorkingCopy,
} = require('../../entities/trialSessions/TrialSessionWorkingCopy');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * updateTrialSessionWorkingCopyInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Array<TrialSession>} the trial session working copy returned from persistence
 */
exports.updateTrialSessionWorkingCopyInteractor = async ({
  applicationContext,
  trialSessionWorkingCopyToUpdate,
}) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, TRIAL_SESSION_WORKING_COPY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const updatedTrialSessionWorkingCopy = await applicationContext
    .getPersistenceGateway()
    .updateTrialSessionWorkingCopy({
      applicationContext,
      trialSessionWorkingCopyToUpdate,
    });

  const trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy(
    updatedTrialSessionWorkingCopy,
  ).validate();
  return trialSessionWorkingCopyEntity.toRawObject();
};
