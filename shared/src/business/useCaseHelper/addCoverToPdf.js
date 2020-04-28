const { PDFDocument } = require('pdf-lib');

const {
  generateCoverPagePdf,
} = require('../utilities/generateHTMLTemplateForPDF/generateCoverPagePdf');
const { generateCoverSheetData } = require('./generateCoverSheetData');

/**
/**
 * a helper function which creates a coversheet, prepends it to a pdf, and returns the new pdf
 *
 * @param {object} options the providers object
 * @param {object} options.applicationContext the application context
 * @param {string} options.caseEntity the case entity associated with the document we are creating the cover for
 * @param {object} options.documentEntity the document entity we are creating the cover for
 * @param {object} options.pdfData the original document pdf data
 * @returns {object} the new pdf with a coversheet attached
 */
exports.addCoverToPdf = async ({
  applicationContext,
  caseEntity,
  documentEntity,
  pdfData,
}) => {
  const coverSheetData = generateCoverSheetData({
    applicationContext,
    caseEntity,
    documentEntity,
  });

  const pdfDoc = await PDFDocument.load(pdfData);

  // allow GC to clear original loaded pdf data
  pdfData = null;

  const coverPagePdf = await generateCoverPagePdf({
    applicationContext,
    content: coverSheetData,
  });

  const coverPageDocument = await PDFDocument.load(coverPagePdf);
  const coverPageDocumentPages = await pdfDoc.copyPages(
    coverPageDocument,
    coverPageDocument.getPageIndices(),
  );

  pdfDoc.insertPage(0, coverPageDocumentPages[0]);

  return pdfDoc.save();
};
