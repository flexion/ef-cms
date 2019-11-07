const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

const removeCaseFromTrial = async ({
  applicationContext,
  caseId,
  caseStatus,
  disposition,
  trialSessionId,
}) => {
  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  if (trialSessionEntity.isCalendared) {
    trialSessionEntity.removeCaseFromCalendar({ caseId, disposition });
  } else {
    trialSessionEntity.deleteCaseFromCalendar({ caseId });
  }

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });

  const myCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(myCase, { applicationContext });

  caseEntity.removeFromTrial(caseStatus);

  await applicationContext
    .getPersistenceGateway()
    .createCaseTrialSortMappingRecords({
      applicationContext,
      caseId: caseEntity.caseId,
      caseSortTags: caseEntity.generateTrialSortTags(),
    });

  return await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });
};

/**
 * removeCaseFromTrialInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to remove from trial
 * @param {string} providers.disposition the reason the case is being removed from trial
 * @param {string} providers.trialSessionId the id of the trial session containing the case to set to removedFromTrial
 * @returns {Promise} the promise of the getCalendaredCasesForTrialSession call
 */
exports.removeCaseFromTrialInteractor = async ({
  applicationContext,
  caseId,
  disposition,
  trialSessionId,
}) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return await removeCaseFromTrial({
    applicationContext,
    caseId,
    disposition,
    trialSessionId,
  });
};

exports.removeCaseFromTrial = removeCaseFromTrial;
