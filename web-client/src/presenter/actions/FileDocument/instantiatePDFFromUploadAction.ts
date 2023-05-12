import { state } from 'cerebral';

/**
 * Validates a file that was uploaded
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the validatePetition use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @returns {object} the next path based on if validation was successful or error
 */
export const instantiatePDFFromUploadAction = async ({
  applicationContext,
  get,
}) => {
  const { primaryDocumentFile } = get(state.form);

  const pdf = await applicationContext
    .getUseCases()
    .createPDFFromUploadInteractor(applicationContext, {
      file: primaryDocumentFile,
    });
  console.log('7');

  return { key: 'primaryDocumentPDF', value: pdf };
};
