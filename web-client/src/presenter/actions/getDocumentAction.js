/**
 * Downloads the document blob who's id matches props.documentId and invokes the props.callback with the blob.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the downloadDocumentFile use case
 * @param {object} providers.props the cerebral props that contains documentId.
 */
export const getDocumentAction = async ({ applicationContext, props }) => {
  const documentBlob = await applicationContext
    .getUseCases()
    .downloadDocumentFile({
      applicationContext,
      documentId: props.documentId,
    });
  props.callback(documentBlob);
};
