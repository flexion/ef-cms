import { setBatchPages } from '../helpers';

export const petitionsClerkCreatesScannedPDF = integrationTest => {
  return it('Petitions clerk creates a PDF from added batches', async () => {
    const selectedDocumentType = integrationTest.getState(
      'currentViewMetadata.documentSelectedForScan',
    );

    setBatchPages({ integrationTest });

    await integrationTest.runSequence('generatePdfFromScanSessionSequence', {
      documentType: selectedDocumentType,
      documentUploadMode: 'preview',
    });

    expect(
      integrationTest.getState(`form.${selectedDocumentType}Size`),
    ).toBeGreaterThan(0);
    expect(
      integrationTest.getState(`form.${selectedDocumentType}`),
    ).toBeDefined();
  });
};
