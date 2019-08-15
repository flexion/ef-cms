import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * utility function used for drying up the code needed to update a docket entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseId the uuid caseId
 * @param {object} providers.docketNumber the docketNumber of the case
 * @param {Function} providers.get the get function for fetching cerebral state
 * @param {Function} providers.runInteractor the interactor to call
 * @returns {Promise} async action
 */
export const handleUpdateDocketEntry = async ({
  applicationContext,
  caseId,
  docketNumber,
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
    isFileAttached: false,
    isPaper: true,
    docketNumber,
    caseId,
    createdAt: applicationContext.getUtilities().createISODateString(),
    receivedAt: documentMetadata.dateReceived,
  };

  const caseDetail = await runInteractor({ documentMetadata });

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
export const updateDocketEntryWithoutFileAction = async ({
  applicationContext,
  get,
}) => {
  const { caseId, docketNumber } = get(state.caseDetail);
  const documentId = get(state.documentId);

  return handleUpdateDocketEntry({
    applicationContext,
    caseId,
    docketNumber,
    documentId,
    get,
    runInteractor: ({ documentMetadata }) => {
      return applicationContext.getUseCases().updateDocketEntryInteractor({
        applicationContext,
        documentMetadata,
        primaryDocumentFileId: documentId,
      });
    },
  });
};
