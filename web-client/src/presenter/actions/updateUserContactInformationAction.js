import { state } from 'cerebral';

/**
 * updates user contact information (for practitioners)
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {Function} providers.get the cerebral get function
 * @returns {object} alertSuccess
 */
export const updateUserContactInformationAction = async ({
  applicationContext,
  get,
}) => {
  const formUser = get(state.form);
  const currentUser = applicationContext.getCurrentUser();

  await applicationContext
    .getUseCases()
    .updateUserContactInformationInteractor({
      applicationContext,
      contactInfo: formUser.contact,
      userId: currentUser.userId,
    });
};
