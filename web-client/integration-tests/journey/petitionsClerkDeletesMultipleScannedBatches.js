export const petitionsClerkDeletesMultipleScannedBatches = (
  integrationTest,
  { numBatches },
) => {
  return it('Petitions clerk deletes multiple batches', async () => {
    const selectedDocumentType = integrationTest.getState(
      'currentViewMetadata.documentSelectedForScan',
    );
    const batches = integrationTest.getState(
      `scanner.batches.${selectedDocumentType}`,
    );

    expect(batches).toHaveLength(numBatches);

    for (let i = 0; i < numBatches; i++) {
      await integrationTest.runSequence('openConfirmDeleteBatchModalSequence', {
        batchIndexToDelete: 0,
      });

      await integrationTest.runSequence('removeBatchSequence');
    }

    expect(batches).toHaveLength(0);
  });
};
