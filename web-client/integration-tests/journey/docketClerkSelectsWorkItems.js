export const docketClerkSelectsWorkItems = integrationTest => {
  return it('Docket clerk selects some work items', async () => {
    const unassignedWorkItem = integrationTest
      .getState('workQueue')
      .find(
        workItem =>
          !workItem.assigneeId &&
          workItem.docketNumber === integrationTest.docketNumber,
      );

    expect(unassignedWorkItem).toBeDefined();
    expect(integrationTest.getState('selectedWorkItems').length).toEqual(0);
    await integrationTest.runSequence('selectWorkItemSequence', {
      workItem: unassignedWorkItem,
    });
    const selectedWorkItems = integrationTest.getState('selectedWorkItems');
    expect(selectedWorkItems.length).toEqual(1);
    integrationTest.selectedWorkItem = selectedWorkItems[0];
  });
};
