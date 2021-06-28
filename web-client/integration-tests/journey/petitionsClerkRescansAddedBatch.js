export const petitionsClerkRescansAddedBatch = integrationTest => {
  return it('Petitions clerk rescans a pre-existing batch', async () => {
    const selectedDocumentType = integrationTest.getState(
      'currentViewMetadata.documentSelectedForScan',
    );

    await integrationTest.runSequence('openConfirmRescanBatchModalSequence', {
      batchIndexToRescan: 0,
    });

    expect(integrationTest.getState('modal.showModal')).toEqual(
      'ConfirmRescanBatchModal',
    );
    expect(integrationTest.getState('scanner.batchIndexToRescan')).toEqual(0);

    await integrationTest.runSequence('rescanBatchSequence');

    expect(integrationTest.getState('modal')).toEqual({});
    expect(
      integrationTest.getState(`scanner.batches.${selectedDocumentType}`)
        .length,
    ).toBeGreaterThan(0);
  });
};
