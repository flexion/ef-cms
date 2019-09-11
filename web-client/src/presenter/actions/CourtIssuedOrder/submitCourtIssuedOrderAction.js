import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * sets the court issued order onto the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const submitCourtIssuedOrderAction = async ({
  applicationContext,
  get,
  props,
}) => {
  let caseDetail;
  const { caseId, docketNumber } = get(state.caseDetail);
  const { primaryDocumentFileId: documentId } = props;
  const formData = get(state.form);
  const { documentIdToEdit } = formData;

  let documentMetadata = omit(formData, [
    'primaryDocumentFile',
    'documentIdToEdit',
  ]);

  documentMetadata = {
    ...documentMetadata,
    docketNumber,
    caseId,
  };

  documentMetadata.draftState = { ...documentMetadata };

  await applicationContext.getUseCases().virusScanPdfInteractor({
    applicationContext,
    documentId,
  });

  await applicationContext.getUseCases().validatePdfInteractor({
    applicationContext,
    documentId,
  });

  // TODO: ghostscript is causing problems with fonts on generated orders
  // - this will be resolved in a cleanup issue later
  /*await applicationContext.getUseCases().sanitizePdfInteractor({
      applicationContext,
      documentId,
    });*/

  if (documentIdToEdit) {
    caseDetail = await applicationContext
      .getUseCases()
      .updateCourtIssuedOrderInteractor({
        applicationContext,
        documentIdToEdit,
        documentMetadata,
      });
  } else {
    caseDetail = await applicationContext
      .getUseCases()
      .fileCourtIssuedOrderInteractor({
        applicationContext,
        documentMetadata,
        primaryDocumentFileId: documentId,
      });
  }

  return {
    caseDetail,
    caseId: docketNumber,
  };
};
