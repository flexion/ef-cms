import { state } from 'cerebral';

/**
 * sets archive draft document state properties (documentId, docketNumber, and documentTitle)
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props incoming cerebral props
 */
export const setArchiveDraftDocumentAction = ({ props, store }) => {
  const {
    docketNumber,
    documentId,
    documentTitle,
    redirectToCaseDetail,
  } = props;

  store.set(state.archiveDraftDocument, {
    docketNumber,
    documentId,
    documentTitle,
    redirectToCaseDetail,
  });
};
