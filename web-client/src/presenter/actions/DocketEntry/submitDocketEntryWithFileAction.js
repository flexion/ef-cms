import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * utility function used for drying up the code needed to upload a docket entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseId the uuid caseId
 * @param {object} providers.docketNumber the docketNumber of the case
 * @param {object} providers.documentId the uuid documentId
 * @param {Function} providers.get the get function for fetching cerebral state
 * @param {Function} providers.runInteractor the interactor to call
 * @returns {Promise} async action
 */
export const handleDocketEntryUpload = async ({
  applicationContext,
  caseId,
  docketNumber,
  documentId,
  get,
  runInteractor,
}) => {
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
    documentId,
  });

  await applicationContext.getUseCases().validatePdfInteractor({
    applicationContext,
    documentId,
  });

  await applicationContext.getUseCases().sanitizePdfInteractor({
    applicationContext,
    documentId,
  });

  const caseDetail = await runInteractor({ documentMetadata });

  await applicationContext.getUseCases().createCoverSheetInteractor({
    applicationContext,
    caseId: caseDetail.caseId,
    documentId,
  });

  return {
    caseDetail,
    caseId: docketNumber,
  };
};

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

  return await handleDocketEntryUpload({
    applicationContext,
    caseId,
    docketNumber,
    documentId: primaryDocumentFileId,
    get,
    runInteractor: ({ documentMetadata }) => {
      return applicationContext.getUseCases().fileDocketEntryInteractor({
        applicationContext,
        documentMetadata,
        primaryDocumentFileId,
      });
    },
  });
};
