export default test => {
  return it('Petitions clerk verifies assignment of work item', async () => {
    const workItemId =
      test.taxpayerNewCase.documents[0].workItems[0].workItemId;

    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');
    const workItem = test
      .getState('workQueue')
      .find(workItem => workItem.workItemId === workItemId);
    expect(workItem).toBeDefined();
  });
};
