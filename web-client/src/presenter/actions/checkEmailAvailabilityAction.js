import { state } from 'cerebral';

/**
 * check if the email is already in use
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path function
 * @returns {object} continue path for the sequence
 */
export const checkEmailAvailabilityAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const { email } = get(state.form);
  const isEmailFree = await applicationContext
    .getUseCases()
    .checkEmailAvailabilityInteractor({
      applicationContext,
      email,
    });

  return isEmailFree
    ? path.emailAvailable()
    : path.emailInUse({
        alertError: {
          title:
            'An account with this email already exists. Enter a new email address.',
        },
      });
};
