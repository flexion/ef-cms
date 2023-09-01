import { PDFDocument } from 'pdf-lib';

export const checkForEncryption = async (e): Promise<boolean> => {
  try {
    // const theFile: File = e.target.files[0];
    const theFile: File = e;
    const pdfText = await theFile.arrayBuffer();
    await PDFDocument.load(pdfText);
  } catch (error) {
    console.log('checkForEncryption e', error);
    if (
      error instanceof Error &&
      error.message.includes(
        'Input document to `PDFDocument.load` is encrypted',
      )
    ) {
      return true;
    }
    return false;
  }
  return false;
};
