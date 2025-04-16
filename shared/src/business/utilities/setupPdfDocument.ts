import { ServerApplicationContext } from '@web-api/applicationContext';
import { PDFDocument as PDFDocumentType, PDFFont } from 'pdf-lib';

export const setupPdfDocument = async ({
  alternateFont = false,
  applicationContext,
  pdfData,
}: {
  applicationContext: ServerApplicationContext;
  pdfData: Uint8Array;
  alternateFont?: boolean;
}): Promise<{ pdfDoc: PDFDocumentType; textFont: PDFFont }> => {
  const { PDFDocument, StandardFonts } = await applicationContext.getPdfLib();
  const pdfDoc = await PDFDocument.load(pdfData);

  const textFont: PDFFont = !alternateFont
    ? pdfDoc.embedStandardFont(StandardFonts.TimesRomanBold)
    : await pdfDoc.embedFont(StandardFonts.CourierBold);

  return { pdfDoc, textFont };
};
