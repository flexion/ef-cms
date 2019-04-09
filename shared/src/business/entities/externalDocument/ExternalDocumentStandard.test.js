const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentStandard', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Standard',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: 'You must select a category.',
        documentType: 'You must select a document type.',
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Application',
        documentType: 'Application for Waiver of Filing Fee',
        scenario: 'Standard',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Application',
        documentType: 'Application for Waiver of Filing Fee',
        scenario: 'Standard',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Application for Waiver of Filing Fee',
      );
    });
  });
});
