const {
  isAuthorized,
  UPDATE_CASE,
} = require('../../authorization/authorizationClientService');
const { Case, STATUS_TYPES } = require('../entities/Case');
const { UnauthorizedError, NotFoundError } = require('../../errors/errors');

/**
 * setCaseToReadyForTrial
 *
 * @param applicationContext
 * @param caseToUpdate
 * @returns {*}
 */
exports.setCaseToReadyForTrial = async ({ applicationContext, caseId }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  const caseEntity = new Case(caseToUpdate);

  caseEntity.status = STATUS_TYPES.generalDocketReadyForTrial;

  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

  await applicationContext
    .getPersistenceGateway()
    .createCaseTrialSortMappingRecords({
      applicationContext,
      caseId,
      caseSortTags: caseEntity.validate().generateTrialSortTags(),
    });

  return updatedCase;
};
