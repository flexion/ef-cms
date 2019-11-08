const moment = require('moment');
const {
  CourtIssuedDocumentNonStandardE,
} = require('./CourtIssuedDocumentNonStandardE');
const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');

const { VALIDATION_ERROR_MESSAGES } = CourtIssuedDocumentNonStandardE;

describe('CourtIssuedDocumentNonStandardE', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const document = CourtIssuedDocumentFactory.get({
        scenario: 'Nonstandard E',
      });
      expect(document.getFormattedValidationErrors()).toEqual({
        attachments: VALIDATION_ERROR_MESSAGES.attachments,
        date: VALIDATION_ERROR_MESSAGES.date[1],
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
      });
    });

    it('should have error message for future date', () => {
      const date = moment()
        .add(1, 'days')
        .format();
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        date,
        documentTitle:
          'Order time is extended to [Date] for petr(s) to pay the filing fee',
        documentType:
          'Order time is extended for petr(s) to pay the filing fee',
        scenario: 'Nonstandard E',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        date: VALIDATION_ERROR_MESSAGES.date[0].message,
      });
    });

    it('should be valid when all fields are present', () => {
      const document = CourtIssuedDocumentFactory.get({
        attachments: false,
        date: '2012-04-10T00:00:00-05:00',
        documentTitle:
          'Order time is extended to [Date] for petr(s) to pay the filing fee',
        documentType:
          'Order time is extended for petr(s) to pay the filing fee',
        scenario: 'Nonstandard E',
      });
      expect(document.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        date: '2012-04-10T00:00:00-05:00',
        documentTitle:
          'Order time is extended to [Date] for petr(s) to pay the filing fee',
        documentType:
          'Order time is extended for petr(s) to pay the filing fee',
        scenario: 'Nonstandard E',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Order time is extended to 04-10-2012 for petr(s) to pay the filing fee',
      );
    });
  });
});
