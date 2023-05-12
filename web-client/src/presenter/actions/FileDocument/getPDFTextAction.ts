import { state } from 'cerebral';

/**
 * convert the file being uploaded to text
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {Function} providers.store the cerebral store used for setting state.form
 * @param {object} providers.get the cerebral get function used for getting state.form
 */
export const getPDFTextAction = async ({ get, store }) => {
  try {
    const { primaryDocumentFile } = get(state.form);

    const text = await new Blob([primaryDocumentFile], {
      type: 'application/pdf',
    }).text();

    store.set(state.form.primaryDocumentFile, {
      file: primaryDocumentFile,
      text,
    });
  } catch (e) {
    console.log(e);
  }
};
