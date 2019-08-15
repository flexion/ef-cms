import { handleUpdateDocketEntry } from './updateDocketEntryWithoutFileAction';
import { state } from 'cerebral';

/**
 * submit a new docket entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const submitDocketEntryWithoutFileAction = async ({
  applicationContext,
  get,
}) => {
  const { caseId, docketNumber } = get(state.caseDetail);

  return handleUpdateDocketEntry({
    applicationContext,
    caseId,
    docketNumber,
    get,
    runInteractor: ({ documentMetadata }) => {
      return applicationContext.getUseCases().fileDocketEntryInteractor({
        applicationContext,
        documentMetadata,
        primaryDocumentFileId: applicationContext.getUniqueId(),
      });
    },
  });
};
