const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { TrialSession } = require('../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * updateCaseStatusInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {object} providers.caseStatus the status to set on the case
 * @returns {object} the updated case data
 */
exports.updateCaseStatusInteractor = async ({
  applicationContext,
  associatedJudge,
  caseId,
  caseStatus,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPDATE_CASE_CONTEXT)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({ applicationContext, caseId });

  const newCase = new Case(oldCase, { applicationContext });

  if (caseStatus) {
    newCase.setCaseStatus(caseStatus);
  }

  if (associatedJudge) {
    newCase.setAssociatedJudge(associatedJudge);
  }

  // if this case status is changing FROM calendared
  // we need to remove it from the trial session
  if (
    oldCase.status === Case.STATUS_TYPES.calendared &&
    caseStatus !== oldCase.status
  ) {
    const disposition = `Status was changed to ${caseStatus}`;

    const trialSession = await applicationContext
      .getPersistenceGateway()
      .getTrialSessionById({
        applicationContext,
        trialSessionId: oldCase.trialSessionId,
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

    newCase.removeFromTrialWithCaseStatus(associatedJudge, caseStatus);
  }

  return await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: newCase.validate().toRawObject(),
  });
};
