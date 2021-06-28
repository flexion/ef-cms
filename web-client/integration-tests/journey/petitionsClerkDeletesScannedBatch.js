export const petitionsClerkDeletesScannedBatch = integrationTest => {
  return it('Petitions clerk deletes a batch', async () => {
    const selectedDocumentType = integrationTest.getState(
      'currentViewMetadata.documentSelectedForScan',
    );
    const batches = integrationTest.getState(
      `scanner.batches.${selectedDocumentType}`,
    );

    await integrationTest.runSequence('openConfirmDeleteBatchModalSequence', {
      batchIndexToDelete: 0,
    });

    await integrationTest.runSequence('removeBatchSequence');

    expect(batches).toHaveLength(0);
  });
};
