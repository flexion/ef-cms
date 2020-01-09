import { state } from 'cerebral';

/**
 * calls proxy endpoint to generate notices for the given trial session
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {object} the next path based upon if there was any paper service or all electronic service
 */
export const setNoticesForCalendaredTrialSessionAction = async ({
  applicationContext,
  get,
  path,
  router,
}) => {
  const { trialSessionId } = get(state.trialSession);

  const pdfBlob = await applicationContext
    .getUseCases()
    .setNoticesForCalendaredTrialSessionInteractor({
      applicationContext,
      trialSessionId,
    });

  if (pdfBlob) {
    const pdfFile = new Blob([pdfBlob], { type: 'application/pdf' });
    const pdfUrl = router.createObjectURL(pdfFile);
    return path.paper({ pdfUrl });
  }

  return path.electronic();
};
