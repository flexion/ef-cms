export const docketClerkViewsSectionInboxNotHighPriority = integrationTest => {
  return it('Docket clerk views section inbox without a high priority item', async () => {
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
    // the work item should no longer be high priority after the case is removed from trial
    expect(inProgressWorkItem.highPriority).toEqual(false);
    expect(inProgressWorkItem.trialDate).toBeFalsy();
  });
};
