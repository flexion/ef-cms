const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * updatePetitionerCases
 * for the provided user, update their email address on all cases
 * where they are the contactPrimary or contactSecondary
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.user the user who is a primary or secondary contact on a case
 * @returns {Promise} resolves upon completion of case updates
 */
const updatePetitionerCases = async ({ applicationContext, user }) => {
  const petitionerCases = await applicationContext
    .getPersistenceGateway()
    .getIndexedCasesForUser({
      applicationContext,
      statuses: applicationContext.getConstants().CASE_STATUSES,
      userId: user.userId,
    });

  const casesToUpdate = await Promise.all(
    petitionerCases.map(({ docketNumber }) =>
      applicationContext.getPersistenceGateway().getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      }),
    ),
  );

  const validatedCasesToUpdate = casesToUpdate
    .map(caseToUpdate => {
      const caseEntity = new Case(caseToUpdate, {
        applicationContext,
      }).toRawObject();

      const petitionerObject = [
        caseEntity.contactPrimary,
        caseEntity.contactSecondary,
      ].find(petitioner => petitioner && petitioner.contactId === user.userId);
      if (!petitionerObject) {
        applicationContext.logger.error(
          `Could not find user|${user.userId} on ${caseEntity.docketNumber}`,
        );
        return;
      }
      // This updates the case by reference!
      petitionerObject.email = user.email;

      // we do this again so that it will convert '' to null
      return new Case(caseEntity, { applicationContext }).validate();
    })
    // if petitioner is not found on the case, function exits early and returns `undefined`.
    // if this happens, continue with remaining cases and do not throw exception, but discard
    // any undefined values by filtering for truthy objects.
    .filter(Boolean);

  return Promise.all(
    validatedCasesToUpdate.map(caseToUpdate =>
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
        applicationContext,
        caseToUpdate,
      }),
    ),
  );
};

exports.updatePetitionerCases = updatePetitionerCases;

/**
 * setUserEmailFromPendingEmailInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.user the user
 * @returns {Promise} the updated user object
 */
exports.setUserEmailFromPendingEmailInteractor = async ({
  applicationContext,
  user,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EMAIL_MANAGEMENT)) {
    throw new UnauthorizedError('Unauthorized to manage emails.');
  }

  const userEntity = new User({
    ...user,
    email: user.pendingEmail,
    pendingEmail: undefined,
  });

  const updatedUser = await applicationContext
    .getPersistenceGateway()
    .updateUser({
      applicationContext,
      user: userEntity.validate().toRawObject(),
    });

  try {
    await updatePetitionerCases({
      applicationContext,
      user: updatedUser,
    });
  } catch (error) {
    applicationContext.logger.error(error);
  }
};
