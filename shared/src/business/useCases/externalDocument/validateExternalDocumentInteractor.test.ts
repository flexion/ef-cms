import { validateExternalDocumentInteractor } from './validateExternalDocumentInteractor';

describe('validateExternalDocumentInteractor', () => {
  it('returns the expected errors object on an empty message', () => {
    const errors = validateExternalDocumentInteractor({
      documentMetadata: {},
    });

    expect(errors).toEqual({
      category: 'Select a Category.',
      documentType: 'Select a document type',
    });
  });

  it('returns no errors when all fields are defined', () => {
    const errors = validateExternalDocumentInteractor({
      documentMetadata: {
        category: 'Application',
        documentType: 'Application for Waiver of Filing Fee',
        scenario: 'Standard',
      },
    });

    expect(errors).toEqual(null);
  });
});
