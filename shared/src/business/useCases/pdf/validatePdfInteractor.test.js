const { validatePdfInteractor } = require('./validatePdfInteractor');

describe('validatePdfInteractor', () => {
  it('calls the validatePdf use-case helper and passes on the provided key', () => {
    const validatePdf = jest.fn().mockReturnValue(true);
    const applicationContext = {
      getUseCaseHelpers: () => ({ validatePdf }),
    };
    const key = 'some-document-key';
    const result = validatePdfInteractor(applicationContext, { key });
    expect(validatePdf).toHaveBeenCalledWith(applicationContext, { key });
    expect(result).toEqual(true);
  });
});
