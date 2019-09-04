import { state } from 'cerebral';

/**
 * downloadBatchOfTrialSessionAction
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} the zipFile
 */
export const downloadBatchOfTrialSessionAction = async ({
  applicationContext,
  props,
  store,
}) => {
  const { caseDetails, trialSessionId } = props;

  const result = await applicationContext
    .getUseCases()
    .batchDownloadTrialSessionInteractor({
      applicationContext,
      caseDetails,
      trialSessionId,
    });
  store.set(state.download, {
    blob: result,
    mimeType: 'application/zip',
  });
};
