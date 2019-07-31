export default test => {
  return it('Petitions clerk deletes a batch', async () => {
    const selectedDocumentType = test.getState('documentSelectedForScan');
    const batches = test.getState(`batches.${selectedDocumentType}`);

    await test.runSequence('openConfirmDeleteBatchModalSequence', {
      batchIndexToDelete: 0,
    });

    await test.runSequence('removeBatchSequence');

    expect(test.getState(`batches.${selectedDocumentType}`)).toHaveLength(0);
  });
};
