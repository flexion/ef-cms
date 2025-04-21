/**
 * opens the practitioner document in a new tab
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object used for clearing alertError, alertSuccess
 */
export const openPractitionerDocumentDownloadUrlAction = async ({
  applicationContext,
  props,
}: ActionProps<{ barNumber: string; practitionerDocumentFileId: string }>) => {
  const { barNumber, practitionerDocumentFileId } = props;

  try {
    const { url } = await applicationContext
      .getUseCases()
      .getPractitionerDocumentDownloadUrlInteractor(applicationContext, {
        barNumber,
        practitionerDocumentFileId,
      });

    applicationContext.getUtilities().openUrlInNewTab({ url });
  } catch (_err: any) {
    const ERROR: Error = _err;
    throw new Error(`Unable to open document. ${ERROR.message}`);
  }
};
