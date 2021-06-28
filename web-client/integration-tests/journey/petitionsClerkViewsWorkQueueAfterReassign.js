export const petitionsClerkViewsWorkQueueAfterReassign = integrationTest => {
  return it('Petitions clerk views work queue after reassign', async () => {
    await integrationTest.runSequence('gotoWorkQueueSequence');
    expect(integrationTest.getState('currentPage')).toEqual('WorkQueue');
    await integrationTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
    });
    const workItem = integrationTest
      .getState('workQueue')
      .find(
        workItemInQueue =>
          workItemInQueue.workItemId === integrationTest.petitionWorkItemId,
      );
    expect(workItem).toBeDefined();
  });
};
