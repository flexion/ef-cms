import { state } from 'cerebral';

/**
 * Validates a file that was uploaded
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the validatePetition use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateFileAction = async ({ applicationContext, get, path }) => {
  const { primaryDocumentPDF } = get(state.form);

  const errors = await applicationContext.getUseCases().validateFileInteractor({
    pdf: primaryDocumentPDF,
  });

  if (errors) {
    return path.error({
      alertError: {
        message:
          'The file you are trying to upload may be encrypted or password protected. Remove the password or encryption and try again.',
        title: 'Please correct the following errors on the page:',
      },
      errors: {
        primaryDocumentFile:
          'The file you are trying to upload may be encrypted or password protected. Remove the password or encryption and try again.',
      },
    });
  }

  return path.success();
};
