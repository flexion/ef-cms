import { state } from 'cerebral';

/**
 * sets the current docket entry data for edit
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 * @returns {void} sets state for docket entry edit
 */
export const setPdfPreviewUrlForCompleteDocketEntryAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const caseDetail = get(state.caseDetail);
  const { documentId } = props;

  const caseDocument = caseDetail.documents.find(
    entry => entry.documentId === documentId,
  );

  if (caseDocument && caseDocument.isFileAttached) {
    const {
      url,
    } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor({
        applicationContext,
        docketNumber: caseDetail.docketNumber,
        documentId,
      });

    store.set(state.pdfPreviewUrl, url);
    store.set(state.currentViewMetadata.documentUploadMode, 'preview');
  }
};
