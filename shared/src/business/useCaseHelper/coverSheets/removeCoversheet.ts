import { IApplicationContext } from 'types/IApplicationContext';

export const removeCoversheet = async (
  applicationContext: IApplicationContext,
  { docketEntryId }: { docketEntryId: string },
): Promise<{ numberOfPages: number }> => {
  let pdfData;
  try {
    ({ Body: pdfData } = await applicationContext.getStorageClient().getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: docketEntryId,
    }));
  } catch (err) {
    const error = err as Error;
    error.message = `${error.message} docket entry id is ${docketEntryId}`;
    throw error;
  }

  const { PDFDocument } = await applicationContext.getPdfLib();

  const pdfDoc = await PDFDocument.load(pdfData);

  pdfDoc.removePage(0);

  const pdfWithoutCoversheet = await pdfDoc.save();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: pdfWithoutCoversheet,
    key: docketEntryId,
  });

  return { numberOfPages: pdfDoc.getPageCount() };
};
