export const docketClerkViewsSectionInboxHighPriority = integrationTest => {
  return it('Docket clerk views section inbox with a high priority item', async () => {
    await integrationTest.runSequence('gotoWorkQueueSequence');
    expect(integrationTest.getState('currentPage')).toEqual('WorkQueue');
    await integrationTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });

    const inboxQueue = integrationTest.getState('workQueue');
    const inProgressWorkItem = inboxQueue.find(
      workItem => workItem.docketNumber === integrationTest.docketNumber,
    );
    // the work item created is high priority and has a trial date
    expect(inProgressWorkItem.highPriority).toEqual(true);
    expect(inProgressWorkItem.trialDate).toBeDefined();
  });
};
