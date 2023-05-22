import { setBatchPages } from '../helpers';

export const petitionsClerkCreatesScannedPDF = cerebralTest => {
  return it('Petitions clerk creates a PDF from added batches', async () => {
    const selectedDocumentType = cerebralTest.getState(
      'currentViewMetadata.documentSelectedForScan',
    );

    setBatchPages({ cerebralTest });

    await cerebralTest.runSequence('generatePdfFromScanSessionSequence', {
      documentUploadMode: 'preview',
      locationOnForm: selectedDocumentType,
    });

    expect(cerebralTest.getState(`form.${selectedDocumentType}`)).toBeDefined();
  });
};
