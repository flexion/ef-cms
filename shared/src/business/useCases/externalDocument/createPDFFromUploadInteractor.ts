import { PDF } from '../../entities/documents/PDF';

/**
 * Validates an uploaded file
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {Array} providers.primaryDocumentFile the primary document file getting uploaded
 * @returns {void}
 */
export const createPDFFromUploadInteractor = async (
  applicationContext: any,
  {
    file,
  }: {
    file: any;
  },
) => {
  const aPDF = new PDF(file);

  try {
    const aBlob = new Blob([file]);

    const arrayBuffer = await aBlob.arrayBuffer();

    const { PDFDocument } = applicationContext.getPdfLib();

    await PDFDocument.load(arrayBuffer);
  } catch (e) {
    if (
      e.message.includes('Input document to `PDFDocument.load` is encrypted')
    ) {
      aPDF.isEncrypted = true;
    }
  }

  return aPDF;
};
