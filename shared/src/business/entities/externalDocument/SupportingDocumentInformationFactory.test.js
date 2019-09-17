const {
  SupportingDocumentInformationFactory,
} = require('./SupportingDocumentInformationFactory');

describe('SupportingDocumentInformationFactory', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = SupportingDocumentInformationFactory.get({});
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        attachments: 'Enter selection for Attachments.',
        certificateOfService:
          'Indicate whether you are including a Certificate of Service',
        supportingDocument: 'Select a document type',
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = SupportingDocumentInformationFactory.get({
        attachments: true,
        certificateOfService: false,
        supportingDocument: 'Brief in Support',
        supportingDocumentFile: {},
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    describe('Has Certificate of Service', () => {
      it('should require certificate of service date be entered', () => {
        const extDoc = SupportingDocumentInformationFactory.get({
          attachments: true,
          certificateOfService: true,
          supportingDocument: 'Brief in Support',
          supportingDocumentFile: {},
        });
        expect(extDoc.getFormattedValidationErrors()).toEqual({
          certificateOfServiceDate: 'Enter date of service',
        });
      });
    });
  });
});
