import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * submit a new docket entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const submitDocketEntryWithFileAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { caseId, docketNumber } = get(state.caseDetail);
  const { primaryDocumentFileId } = props;

  let documentMetadata = omit(
    {
      ...get(state.form),
    },
    ['primaryDocumentFile'],
  );

  documentMetadata = {
    ...documentMetadata,
    isFileAttached: true,
    isPaper: true,
    docketNumber,
    caseId,
    createdAt: applicationContext.getUtilities().createISODateString(),
    receivedAt: documentMetadata.dateReceived,
  };

  await applicationContext.getUseCases().virusScanPdfInteractor({
    applicationContext,
    documentId: primaryDocumentFileId,
  });

  await applicationContext.getUseCases().validatePdfInteractor({
    applicationContext,
    documentId: primaryDocumentFileId,
  });

  await applicationContext.getUseCases().sanitizePdfInteractor({
    applicationContext,
    documentId: primaryDocumentFileId,
  });

  const caseDetail = await applicationContext
    .getUseCases()
    .fileDocketEntryInteractor({
      applicationContext,
      documentMetadata,
      primaryDocumentFileId,
    });

  await applicationContext.getUseCases().createCoverSheetInteractor({
    applicationContext,
    caseId: caseDetail.caseId,
    documentId: primaryDocumentFileId,
  });

  return {
    caseDetail,
    caseId: docketNumber,
  };
};
