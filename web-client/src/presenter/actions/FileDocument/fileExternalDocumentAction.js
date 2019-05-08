import { state } from 'cerebral';

/**
 * Set document title.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context
 * @param {Object} providers.props the cerebral props object
 */
export const fileExternalDocumentAction = async ({
  get,
  applicationContext,
}) => {
  const { docketNumber, caseId } = get(state.caseDetail);

  let {
    primaryDocumentFile,
    secondaryDocumentFile,
    supportingDocumentFile,
    secondarySupportingDocumentFile,
    ...documentMetadata
  } = get(state.form);

  documentMetadata = { ...documentMetadata, docketNumber, caseId };

  const caseDetail = await applicationContext
    .getUseCases()
    .uploadExternalDocument({
      applicationContext,
      documentMetadata,
      primaryDocumentFile,
      secondaryDocumentFile,
      secondarySupportingDocumentFile,
      supportingDocumentFile,
    });

  for (let document of caseDetail.documents) {
    if (document.processingStatus === 'pending') {
      await applicationContext.getUseCases().createCoverSheet({
        applicationContext,
        caseId: caseDetail.caseId,
        documentId: document.documentId,
      });
    }
  }

  return {
    caseDetail,
    caseId: docketNumber,
  };
};
