import { setBatchPages } from '../helpers';

export default test => {
  return it('Petitions clerk creates a PDF from added batches', async () => {
    const selectedDocumentType = test.getState('documentSelectedForScan');

    setBatchPages({ test });

    await test.runSequence('generatePdfFromScanSessionSequence', {
      documentType: selectedDocumentType,
      documentUploadMode: 'preview',
    });

    expect(test.getState(`form.${selectedDocumentType}Size`)).toBeGreaterThan(
      0,
    );
    expect(test.getState(`form.${selectedDocumentType}`)).toBeDefined();
  });
};
