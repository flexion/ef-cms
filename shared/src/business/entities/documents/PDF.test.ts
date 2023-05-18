import { MAX_FILE_SIZE_BYTES } from '../EntityConstants';
import { PDF } from './PDF';

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

    it('should be invalid when the PDF is encrypted', () => {
      const pdfEntity = new PDF({ isEncrypted: true, size: 1 });

      const validationErrors = pdfEntity.getFormattedValidationErrors();

      expect(Object.keys(validationErrors!)).toEqual(['isEncrypted']);
    });
  });
});
