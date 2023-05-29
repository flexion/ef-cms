import { MAX_FILE_SIZE_BYTES } from '../EntityConstants';
import { PDF } from './PDF';
import { encryptedPdfBase64 } from '../../test/encryptedPdf';

describe('PDF entity', () => {
  describe('validation', () => {
    it('should be invalid when required fields are not provided', () => {
      const pdfEntity = new PDF({});

      const validationErrors = pdfEntity.getFormattedValidationErrors();

      expect(Object.keys(validationErrors!)).toEqual(['size']);
    });

    it('should be invalid when the size of the file is larger than allowed by DAWSON', () => {
      const pdfEntity = new PDF({ size: MAX_FILE_SIZE_BYTES + 1 });

      const validationErrors = pdfEntity.getFormattedValidationErrors();

      expect(Object.keys(validationErrors!)).toEqual(['size']);
    });

    it('should be invalid when the PDF is encrypted', async () => {
      const mockEncryptedPdf = new Blob([encryptedPdfBase64]);

      const pdfEntity = new PDF(mockEncryptedPdf);

      const validationErrors =
        await pdfEntity.getFormattedValidationErrorsAsync();

      expect(validationErrors).toEqual({
        file: 'The file you are trying to upload may be encrypted or password protected. Remove the password or encryption and try again.',
      });
    });
  });
});
