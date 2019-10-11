const {
  ASSOCIATE_USER_WITH_CASE,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * updateCounselOnCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case the user is attached to
 * @param {object} providers.userData the data being updated on the user
 * @param {string} providers.userIdToUpdate the id of the user to be updated on the case
 * @returns {Promise} the promise of the update case call
 */
exports.updateCounselOnCaseInteractor = async ({
  applicationContext,
  caseId,
  userData,
  userIdToUpdate,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ASSOCIATE_USER_WITH_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const userToUpdate = await applicationContext
    .getPersistenceGateway()
    .getUserById({
      applicationContext,
      userId: userIdToUpdate,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  if (userToUpdate.role === 'practitioner') {
    // should we create a Practitioner entity here and call validate() before saving?
    caseEntity.updatePractitioner({ userId: userToUpdate.userId, ...userData });
  } else if (userToUpdate.role === 'respondent') {
    // should we create a Respondent entity here and call validate() before saving?
    caseEntity.updateRespondent({ userId: userToUpdate.userId, ...userData });
  }

  return await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });
};
