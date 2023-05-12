export const setupPdfDocument = async ({ applicationContext, pdfData }) => {
  const { PDFDocument, StandardFonts } = applicationContext.getPdfLib();
  const pdfDoc = await PDFDocument.load(pdfData);

  const textFont = pdfDoc.embedStandardFont(StandardFonts.TimesRomanBold);

  return { pdfDoc, textFont };
};
