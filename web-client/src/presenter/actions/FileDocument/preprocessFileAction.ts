import { state } from 'cerebral';

/**
 * convert the file being uploaded to text
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {Function} providers.store the cerebral store used for setting state.form
 * @param {object} providers.get the cerebral get function used for getting state.form
 */
export const preprocessFileAction = async ({ get, store }) => {
  // TODO: refactor to process STIN, petition, corporateDisclosure for start case flow
  const { primaryDocumentFile } = get(state.form);

  let text;

  try {
    text = await new Blob([primaryDocumentFile], {
      type: 'application/pdf',
    }).text();
  } catch (e) {
    console.log(e);
  }
  store.set(state.form.primaryDocumentFileText, text);
};
