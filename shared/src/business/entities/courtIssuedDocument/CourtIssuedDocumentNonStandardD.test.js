const moment = require('moment');
const {
  CourtIssuedDocumentNonStandardD,
} = require('./CourtIssuedDocumentNonstandardD');
const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');

const { VALIDATION_ERROR_MESSAGES } = CourtIssuedDocumentNonStandardD;

describe('CourtIssuedDocumentNonStandardD', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const document = CourtIssuedDocumentFactory.get({
        scenario: 'Nonstandard D',
      });
      expect(document.getFormattedValidationErrors()).toEqual({
        attachments: VALIDATION_ERROR_MESSAGES.attachments,
        date: VALIDATION_ERROR_MESSAGES.date[1],
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
        freeText: VALIDATION_ERROR_MESSAGES.freeText,
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
          'Order for Amended Petition and Filing Fee on [Date] [Anything]',
        documentType: 'Order for Amended Petition and Filing Fee',
        freeText: 'Some free text',
        scenario: 'Nonstandard D',
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
          'Order for Amended Petition and Filing Fee on [Date] [Anything]',
        documentType: 'Order for Amended Petition and Filing Fee',
        freeText: 'Some free text',
        scenario: 'Nonstandard D',
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
          'Order for Amended Petition and Filing Fee on [Date] [Anything]',
        documentType: 'Order for Amended Petition and Filing Fee',
        freeText: 'Some free text',
        scenario: 'Nonstandard D',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Order for Amended Petition and Filing Fee on 04-10-2012 Some free text',
      );
    });
  });
});
