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
  console.log('1****');
  try {
    console.log('2****');

    const aBlob = new Blob([file]);
    console.log('3');

    const arrayBuffer = await aBlob.arrayBuffer();
    console.log('4');

    const { PDFDocument } = applicationContext.getPdfLib();
    console.log('5');

    await PDFDocument.load(arrayBuffer);
  } catch (e) {
    console.log('6', e);

    if (
      e.message.includes('Input document to `PDFDocument.load` is encrypted')
    ) {
      aPDF.isEncrypted = true;
    }
  }

  return aPDF;
};
