export const petitionsClerkAddsScannedBatch = (
  integrationTest,
  { scannerSourceIndex, scannerSourceName },
) => {
  return it('Petitions clerk adds a batch of scanned documents', async () => {
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
