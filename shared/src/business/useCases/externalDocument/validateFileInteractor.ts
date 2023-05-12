import { PDF } from '../../entities/documents/PDF';

/**
 * Validates an uploaded file
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {Array} providers.primaryDocumentFile the primary document file getting uploaded
 * @returns {void}
 */
export const validateFileInteractor = (
  applicationContext: any,
  {
    primaryDocumentFile,
  }: // primaryDocumentFileText,
  {
    applicationContext: any;
    primaryDocumentFile: any;
    // primaryDocumentFileText: string;
  },
) => {
  console.log('***** ', primaryDocumentFile);
  const aPdf = new PDF({
    document: primaryDocumentFile,
  });

  console.log(aPdf.getFormattedValidationErrors(), ' ****');

  return aPdf.getFormattedValidationErrors();
};
