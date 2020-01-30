const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { CaseDeadline } = require('../../entities/CaseDeadline');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * createCaseDeadlineInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseDeadline the case deadline data
 * @returns {CaseDeadline} the created case deadline
 */
exports.createCaseDeadlineInteractor = async ({
  applicationContext,
  caseDeadline,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized for create case deadline');
  }

  const newCaseDeadline = new CaseDeadline(caseDeadline, {
    applicationContext,
  });

  await applicationContext.getPersistenceGateway().createCaseDeadline({
    applicationContext,
    caseDeadline: newCaseDeadline.validate().toRawObject(),
  });

  const caseDetail = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId: caseDeadline.caseId,
    });
  const caseEntity = new Case(caseDetail, { applicationContext });
  const blockedReason = caseEntity.hasPendingItems
    ? Case.AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate
    : Case.AUTOMATIC_BLOCKED_REASONS.dueDate;
  caseEntity.setAsAutomaticBlocked(blockedReason);

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return newCaseDeadline;
};
