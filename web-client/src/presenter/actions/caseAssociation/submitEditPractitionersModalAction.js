import { state } from 'cerebral';

/**
 * submits the edit practitioners modal, removing and/or updating the practitioners on the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.get the cerebral get function used for getting state.form and state.caseDetail.caseId
 * @param {object} providers.path the next object in the path
 * @returns {Promise<*>} the success path
 */
export const submitEditPractitionersModalAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const form = get(state.form);
  const caseId = get(state.caseDetail.caseId);

  const { practitioners } = form;

  const calls = [];

  practitioners.forEach(practitioner => {
    if (practitioner.removeFromCase) {
      calls.push(
        applicationContext.getUseCases().deleteCounselFromCaseInteractor({
          applicationContext,
          caseId,
          userIdToDelete: practitioner.userId,
        }),
      );
    } else {
      calls.push(
        applicationContext.getUseCases().updateCounselOnCaseInteractor({
          applicationContext,
          caseId,
          userData: practitioner,
          userIdToUpdate: practitioner.userId,
        }),
      );
    }
  });

  await Promise.all(calls);

  return path.success({
    alertSuccess: {
      message: 'You can view your changes below.',
      title: 'Petitioner Counsel has been updated.',
    },
  });
};
