import { setBatchPages } from './helpers';

export const addBatchesForScanning = (
  integrationTest,
  { scannerSourceIndex, scannerSourceName },
) => {
  return it('Adds a batch of scanned documents', async () => {
    await integrationTest.runSequence('startScanSequence', {
      scannerSourceIndex,
      scannerSourceName,
    });

    const selectedDocumentType = integrationTest.getState(
      'currentViewMetadata.documentSelectedForScan',
    );

    expect(
      integrationTest.getState(`scanner.batches.${selectedDocumentType}`)
        .length,
    ).toBeGreaterThan(0);
    expect(Object.keys(integrationTest.getState('scanner.batches'))).toEqual([
      selectedDocumentType,
    ]);
  });
};
export const createPDFFromScannedBatches = integrationTest => {
  return it('Creates a PDF from added batches', async () => {
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

export const selectScannerSource = (
  integrationTest,
  { scannerSourceIndex, scannerSourceName },
) => {
  return it('Selects a scanner', async () => {
    await integrationTest.runSequence('openChangeScannerSourceModalSequence');

    expect(integrationTest.getState('modal.showModal')).toEqual(
      'SelectScannerSourceModal',
    );

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'scanner',
      value: scannerSourceName,
    });

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'index',
      value: scannerSourceIndex,
    });

    await integrationTest.runSequence('selectScannerSequence', {
      scannerSourceIndex,
      scannerSourceName,
    });

    expect(integrationTest.getState('scanner.scannerSourceIndex')).toEqual(
      scannerSourceIndex,
    );
    expect(integrationTest.getState('scanner.scannerSourceName')).toEqual(
      scannerSourceName,
    );

    expect(integrationTest.getState('modal')).toMatchObject({});
  });
};
