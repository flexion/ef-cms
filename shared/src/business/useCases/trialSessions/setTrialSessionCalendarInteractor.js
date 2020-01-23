const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * set trial session calendar
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialSessionId the id of the trial session to set the calendar
 * @returns {Promise} the promise of the updateTrialSession call
 */
exports.setTrialSessionCalendarInteractor = async ({
  applicationContext,
  trialSessionId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  trialSessionEntity.validate();

  trialSessionEntity.setAsCalendared();

  //get cases that have been manually added so we can set them as calendared
  const manuallyAddedCases = (
    await applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession({
        applicationContext,
        trialSessionId,
      })
  ).filter(
    manualCase => manualCase.qcCompleteForTrial[trialSessionId] === true,
  );

  let eligibleCasesLimit = trialSessionEntity.maxCases;

  if (manuallyAddedCases && manuallyAddedCases.length > 0) {
    eligibleCasesLimit -= manuallyAddedCases.length;
  }

  const eligibleCases = (
    await applicationContext
      .getPersistenceGateway()
      .getEligibleCasesForTrialSession({
        applicationContext,
        limit: eligibleCasesLimit,
        skPrefix: trialSessionEntity.generateSortKeyPrefix(),
      })
  ).filter(
    eligibleCase => eligibleCase.qcCompleteForTrial[trialSessionId] === true,
  );

  /**
   * sets a manually added case as calendared with the trial session details
   *
   * @param {object} caseRecord the providers object
   * @returns {Promise} the promise of the updateCase call
   */
  const setManuallyAddedCaseAsCalendared = caseRecord => {
    const caseEntity = new Case(caseRecord, { applicationContext });

    caseEntity.setAsCalendared(trialSessionEntity);

    return Promise.all([
      applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems({
        applicationContext,
        caseId: caseEntity.caseId,
        highPriority: true,
        trialDate: caseEntity.trialDate,
      }),
      applicationContext.getPersistenceGateway().updateCase({
        applicationContext,
        caseToUpdate: caseEntity.validate().toRawObject(),
      }),
    ]);
  };

  /**
   * sets an eligible case as calendared and adds it to the trial session calendar
   *
   * @param {object} caseRecord the providers object
   * @returns {Promise} the promises of the updateCase and deleteCaseTrialSortMappingRecords calls
   */
  const setTrialSessionCalendarForEligibleCase = caseRecord => {
    const { caseId } = caseRecord;
    const caseEntity = new Case(caseRecord, { applicationContext });

    caseEntity.setAsCalendared(trialSessionEntity);
    trialSessionEntity.addCaseToCalendar(caseEntity);

    return Promise.all([
      applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems({
        applicationContext,
        caseId: caseEntity.caseId,
        highPriority: true,
        trialDate: caseEntity.trialDate,
      }),
      applicationContext.getPersistenceGateway().updateCase({
        applicationContext,
        caseToUpdate: caseEntity.validate().toRawObject(),
      }),
      applicationContext
        .getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords({
          applicationContext,
          caseId,
        }),
    ]);
  };

  await Promise.all([
    ...manuallyAddedCases.map(setManuallyAddedCaseAsCalendared),
    ...eligibleCases.map(setTrialSessionCalendarForEligibleCase),
  ]);

  return await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });
};
