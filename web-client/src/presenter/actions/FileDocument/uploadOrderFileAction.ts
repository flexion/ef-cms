import { state } from 'cerebral';

/**
 * Upload document to s3
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the next object in the path
 * @returns {object} the next path based on if validation was successful or error
 */
export const uploadOrderFileAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { primaryDocumentFile } = get(state.form);

  try {
    const primaryDocumentFileId = await applicationContext
      .getUseCases()
      .uploadOrderDocumentInteractor(applicationContext, {
        documentFile: primaryDocumentFile.file,
      });

    return path.success({
      primaryDocumentFileId,
    });
  } catch (err) {
    return path.error();
  }
};
