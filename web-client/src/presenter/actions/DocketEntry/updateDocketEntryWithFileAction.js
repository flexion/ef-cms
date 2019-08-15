import { state } from 'cerebral';

import { handleDocketEntryUpload } from './submitDocketEntryWithFileAction';

/**
 * submit a new docket entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const updateDocketEntryWithFileAction = async ({
  applicationContext,
  get,
}) => {
  const { caseId, docketNumber } = get(state.caseDetail);
  const documentId = get(state.documentId);

  return await handleDocketEntryUpload({
    applicationContext,
    caseId,
    docketNumber,
    documentId,
    get,
    runInteractor: ({ documentMetadata }) => {
      return applicationContext.getUseCases().fileDocketEntryInteractor({
        applicationContext,
        documentMetadata,
        primaryDocumentFileId: documentId,
      });
    },
  });
};
