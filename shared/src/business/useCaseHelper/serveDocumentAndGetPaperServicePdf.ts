import { Case } from '../entities/cases/Case';
import { IApplicationContext } from 'types/IApplicationContext';
import { aggregatePartiesForService } from '../utilities/aggregatePartiesForService';
import { saveFileAndGenerateUrl } from './saveFileAndGenerateUrl';

export const serveDocumentAndGetPaperServicePdf = async ({
  applicationContext,
  caseEntities,
  docketEntryId,
  stampedPdf,
}: {
  applicationContext: IApplicationContext;
  caseEntities: Case[];
  docketEntryId: string;
  stampedPdf?: any;
}): Promise<
  | {
      pdfUrl: string;
    }
  | undefined
> => {
  const { PDFDocument } = await applicationContext.getPdfLib();

  let originalPdfDoc;

  let newPdfDoc = await PDFDocument.create();

  for (const caseEntity of caseEntities) {
    const servedParties = aggregatePartiesForService(caseEntity);

    await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      docketEntryId,
      servedParties,
    });

    if (servedParties.paper.length > 0) {
      if (!originalPdfDoc) {
        let pdfData;
        if (stampedPdf) {
          originalPdfDoc = await PDFDocument.load(stampedPdf);
        } else {
          pdfData = await applicationContext.getStorageClient().getObject({
            Bucket: applicationContext.environment.documentsBucketName,
            Key: docketEntryId,
          });
          pdfData = pdfData.Body;
          originalPdfDoc = await PDFDocument.load(pdfData);
        }
      }

      await applicationContext
        .getUseCaseHelpers()
        .appendPaperServiceAddressPageToPdf({
          applicationContext,
          caseEntity,
          newPdfDoc,
          noticeDoc: originalPdfDoc,
          servedParties,
        });
    }
  }

  if (newPdfDoc.getPageCount() > 0) {
    const paperServicePdfData = await newPdfDoc.save();
    const { url } = await saveFileAndGenerateUrl({
      applicationContext,
      file: paperServicePdfData,
      useTempBucket: true,
    });

    return { pdfUrl: url };
  }
};
