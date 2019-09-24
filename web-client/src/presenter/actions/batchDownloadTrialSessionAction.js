/**
 * sets the state.submitting to false
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.submitting
 */
export const batchDownloadTrialSessionAction = async ({
  applicationContext,
  props,
}) => {
  await applicationContext.getUseCases().batchDownloadTrialSessionInteractor({
    applicationContext,
    trialSessionId: props.trialSessionId,
    zipName: props.zipName,
  });
};
