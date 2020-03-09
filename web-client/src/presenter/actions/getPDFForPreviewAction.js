/**
 * given a caseId and documentId, fetch a PDF from S3 and put into props stream.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.props used for getting caseId and documentId
 */
export const getPDFForPreviewAction = async ({ applicationContext, props }) => {
  if (props.file.name) {
    return props;
  }
  const { caseId, documentId } = props.file;

  const pdfObj = await applicationContext
    .getUseCases()
    .loadPDFForPreviewInteractor({
      applicationContext,
      caseId,
      documentId,
    });
  return { file: pdfObj };
};
