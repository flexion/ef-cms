const {
  CourtIssuedDocumentNonStandardA,
} = require('./CourtIssuedDocumentNonStandardA');
const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');

const { VALIDATION_ERROR_MESSAGES } = CourtIssuedDocumentNonStandardA;

describe('CourtIssuedDocumentNonStandardA', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const document = CourtIssuedDocumentFactory.get({
        scenario: 'Nonstandard A',
      });
      expect(document.getFormattedValidationErrors()).toEqual({
        attachments: VALIDATION_ERROR_MESSAGES.attachments,
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
        freeText: VALIDATION_ERROR_MESSAGES.freeText,
      });
    });

    it('should be valid when all fields are present', () => {
      const document = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: 'Order [Anything]',
        documentType: 'Order',
        freeText: 'Some free text',
        scenario: 'Nonstandard A',
      });
      expect(document.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: 'Order [Anything]',
        documentType: 'Order',
        freeText: 'Some free text',
        scenario: 'Nonstandard A',
      });
      expect(extDoc.getDocumentTitle()).toEqual('Order Some free text');
    });
  });
});
