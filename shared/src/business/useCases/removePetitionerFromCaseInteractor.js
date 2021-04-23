const {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
} = require('../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * used to remove a petitioner from a case
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.contactId the contactId of the person to remove from the case
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {object} the case data
 */

exports.removePetitionerFromCaseInteractor = async (
  applicationContext,
  { contactId, docketNumber },
) => {
  const petitionerContactId = contactId;
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.EDIT_PETITIONER_INFO)) {
    throw new UnauthorizedError(
      'Unauthorized for removing petitioner from case',
    );
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  if (caseToUpdate.status === CASE_STATUS_TYPES.new) {
    throw new Error(
      `Case with docketNumber ${caseToUpdate.docketNumber} has not been served`,
    );
  }

  if (caseEntity.petitioners.length <= 1) {
    throw new Error(
      `Cannot remove petitioner ${petitionerContactId} from case with docketNumber ${caseToUpdate.docketNumber}`,
    );
  }

  const isPetitionerToRemovePrimary =
    caseEntity.getPetitionerById(contactId).contactType ===
    CONTACT_TYPES.primary;

  const practitioners = caseEntity.getPractitionersRepresenting(
    petitionerContactId,
  );
  for (const practitioner of practitioners) {
    if (
      practitioner.isRepresenting(petitionerContactId) &&
      practitioner.representing.length === 1
    ) {
      caseEntity.removePrivatePractitioner(practitioner);

      await applicationContext.getPersistenceGateway().deleteUserFromCase({
        applicationContext,
        docketNumber,
        userId: practitioner.userId,
      });
    }
  }

  caseEntity.removePetitioner(petitionerContactId);

  if (isPetitionerToRemovePrimary) {
    caseEntity.petitioners[0].contactType = CONTACT_TYPES.primary;
  }

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
