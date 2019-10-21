const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');
const {
  isAuthorized,
  PRIORITIZE_CASE,
} = require('../../authorization/authorizationClientService');

/**
 * used for setting a case as high priority
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.reason the reason the case is being set as high priority
 * @param {string} providers.caseId the caseId to set as high priority
 * @returns {object} the case data
 */
exports.prioritizeCaseInteractor = async ({
  applicationContext,
  caseId,
  reason,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, PRIORITIZE_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  if (caseEntity.isCalendared()) {
    throw new Error('Cannot set a calendared case as high priority');
  }
  if (caseEntity.blocked === true) {
    throw new Error('Cannot set a blocked case as high priority');
  }

  caseEntity.setAsHighPriority(reason);

  await applicationContext
    .getPersistenceGateway()
    .updateCaseTrialSortMappingRecords({
      applicationContext,
      caseId: caseEntity.caseId,
      caseSortTags: caseEntity.generateTrialSortTags(),
    });

  return await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });
};
