const moment = require('moment');
const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');

describe('ExternalDocumentNonStandardD', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard D',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: VALIDATION_ERROR_MESSAGES.category,
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
        previousDocument: VALIDATION_ERROR_MESSAGES.previousDocument,
        serviceDate: VALIDATION_ERROR_MESSAGES.serviceDate[1],
      });
    });

    it('should have error message for future date', () => {
      const serviceDate = moment()
        .add(1, 'days')
        .format();
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: 'Certificate of Service [Document Name] [Date]',
        documentType: 'Certificate of Service',
        previousDocument: 'Petition',
        scenario: 'Nonstandard D',
        serviceDate,
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        serviceDate: VALIDATION_ERROR_MESSAGES.serviceDate[0].message,
      });
    });

    it('should be valid when all fields are present', () => {
      const serviceDate = moment().format();
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: 'Certificate of Service [Document Name] [Date]',
        documentType: 'Certificate of Service',
        previousDocument: 'Petition',
        scenario: 'Nonstandard D',
        serviceDate,
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when serviceDate is undefined-undefined-undefined', () => {
      const serviceDate = 'undefined-undefined-undefined';
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: 'Certificate of Service [Document Name] [Date]',
        documentType: 'Certificate of Service',
        previousDocument: 'Petition',
        scenario: 'Nonstandard D',
        serviceDate,
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        serviceDate: VALIDATION_ERROR_MESSAGES.serviceDate[1],
      });
    });
  });

  describe('title generation', () => {
    const serviceDate = '2012-04-10T00:00:00-05:00';
    it('should generate valid title', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: 'Certificate of Service [Document Name] [Date]',
        documentType: 'Certificate of Service',
        previousDocument: 'Petition',
        scenario: 'Nonstandard D',
        serviceDate,
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Certificate of Service Petition 04-10-2012',
      );
    });
  });
});
