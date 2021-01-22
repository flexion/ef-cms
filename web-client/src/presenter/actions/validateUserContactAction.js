import { state } from 'cerebral';

/**
 * validate the case or session note
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateUserContactAction = ({
  applicationContext,
  get,
  path,
}) => {
  const formContact = get(state.form);
  const currentUser = applicationContext.getCurrentUser();

  let errors = applicationContext.getUseCases().validateUserContactInteractor({
    applicationContext,
    user: {
      ...currentUser,
      contact: formContact.contact,
      email: formContact.email,
    },
  });

  if (
    formContact.originalEmail.toLowerCase() !==
      formContact.email.toLowerCase() &&
    formContact.confirmEmail !== formContact.email
  ) {
    if (!errors) {
      errors = {};
    }
    errors.confirmEmail = 'Email addresses do not match.';
  }

  if (!errors) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors: {
        contact: errors,
        email: errors.email,
      },
    });
  }
};
