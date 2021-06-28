export const docketClerkViewsSectionQCInProgress = (
  integrationTest,
  shouldExist,
) => {
  return it('Docket clerk views Section Document QC - In Progress', async () => {
    await integrationTest.runSequence('gotoWorkQueueSequence');
    expect(integrationTest.getState('currentPage')).toEqual('WorkQueue');
    await integrationTest.runSequence('chooseWorkQueueSequence', {
      box: 'inProgress',
      queue: 'section',
    });

    const workQueueToDisplay = integrationTest.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('section');
    expect(workQueueToDisplay.box).toEqual('inProgress');

    const inProgressQueue = integrationTest.getState('workQueue');
    const inProgressWorkItem = inProgressQueue.find(
      workItem =>
        workItem.docketEntry.docketEntryId ===
        integrationTest.docketRecordEntry.docketEntryId,
    );

    if (shouldExist) {
      expect(inProgressWorkItem).toBeTruthy();
      expect(inProgressWorkItem.docketEntry.otherFilingParty).toEqual(
        'Brianna Noble',
      );
    } else {
      expect(inProgressWorkItem).toBeFalsy();
    }
  });
};
