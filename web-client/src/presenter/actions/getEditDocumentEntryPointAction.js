import { state } from 'cerebral';

/**
 * determines the redirect path after editing a document
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence
 * @param {object} providers.store the cerebral store
 * @returns {object} the redirect path
 */
export const getEditDocumentEntryPointAction = async ({ get, path, store }) => {
  let editDocumentEntryPoint =
    get(state.editDocumentEntryPoint) || 'DocumentDetail';

  store.unset(state.editDocumentEntryPoint);

  return path[editDocumentEntryPoint]();
};
