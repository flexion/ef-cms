export const petitionsClerkViewsScanView = integrationTest => {
  return it('Petitions clerk views the Petition tab selected by default', async () => {
    expect(
      integrationTest.getState('currentViewMetadata.documentSelectedForScan'),
    ).toEqual('petitionFile');
  });
};
