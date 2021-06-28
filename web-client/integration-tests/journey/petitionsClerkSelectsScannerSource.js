export const petitionsClerkSelectsScannerSource = (
  integrationTest,
  { scannerSourceIndex, scannerSourceName },
) => {
  return it('Petitions clerk selects a scanner', async () => {
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
