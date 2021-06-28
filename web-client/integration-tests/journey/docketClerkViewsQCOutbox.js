export const docketClerkViewsQCOutbox = (integrationTest, shouldExist) => {
  return it('Docket clerk views My Document QC - Outbox', async () => {
    await integrationTest.runSequence('gotoWorkQueueSequence');
    expect(integrationTest.getState('currentPage')).toEqual('WorkQueue');
    await integrationTest.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'my',
    });

    const workQueueToDisplay = integrationTest.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('my');
    expect(workQueueToDisplay.box).toEqual('outbox');

    const outboxQueue = integrationTest.getState('workQueue');
    const outboxWorkItem = outboxQueue.find(
      workItem =>
        workItem.docketEntry.docketEntryId === integrationTest.docketEntryId,
    );
    if (shouldExist) {
      expect(outboxWorkItem).toBeTruthy();
    } else {
      expect(outboxWorkItem).toBeFalsy();
    }
  });
};
