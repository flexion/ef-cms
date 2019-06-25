import { state } from 'cerebral';

/**
 * given a PDF document, returns a pdf.js object
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting loadPDFForSigning
 * @param {Function} providers.props used for getting documentId
 * @param {Function} providers.store the cerebral store used for setting state.pdfForSigning.pdfjsObj

 */
export const setPDFForSigningAction = async ({
  applicationContext,
  props,
  store,
}) => {
  const { documentId } = props;
  const pdfObj = await applicationContext
    .getUseCases()
    .loadPDFForSigning({ applicationContext, documentId });
  store.set(state.pdfForSigning.pdfjsObj, pdfObj);
};
