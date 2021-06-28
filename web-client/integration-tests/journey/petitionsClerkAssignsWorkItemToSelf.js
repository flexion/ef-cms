import { applicationContextForClient as applicationContext } from '../../../shared/src/business//test/createTestApplicationContext';

const { PETITIONS_SECTION } = applicationContext.getConstants();

export const petitionsClerkAssignsWorkItemToSelf = integrationTest => {
  return it('Petitions clerk assigns work item to self', async () => {
    // find the work item that is part of an Petition upload
    const sectionWorkItems = integrationTest.getState('workQueue');
    integrationTest.petitionWorkItemId = sectionWorkItems.find(
      item =>
        item.docketEntry.documentType === 'Petition' &&
        item.docketNumber === integrationTest.docketNumber,
    ).workItemId;

    // verify that there is an unassigned work item in the section queue; we will assign it
    const unassignedWorkItem = integrationTest
      .getState('workQueue')
      .find(
        workItem =>
          !workItem.assigneeId &&
          workItem.docketNumber === integrationTest.docketNumber &&
          workItem.workItemId === integrationTest.petitionWorkItemId,
      );
    expect(unassignedWorkItem).toBeDefined();
    expect(integrationTest.getState('selectedWorkItems').length).toEqual(0);

    // select that work item
    await integrationTest.runSequence('selectWorkItemSequence', {
      workItem: unassignedWorkItem,
    });
    const selectedWorkItems = integrationTest.getState('selectedWorkItems');
    expect(selectedWorkItems.length).toEqual(1);
    integrationTest.selectedWorkItem = selectedWorkItems[0];
    expect(unassignedWorkItem).toMatchObject({
      assigneeId: null,
    });

    // select an assignee
    expect(integrationTest.getState('assigneeId')).toBeNull();
    await integrationTest.runSequence('selectAssigneeSequence', {
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test Petitionsclerk',
    });
    expect(integrationTest.getState('assigneeId')).toBeDefined();

    // assign that work item to the current user
    await integrationTest.runSequence('assignSelectedWorkItemsSequence');

    // should clear the selected work items
    expect(integrationTest.getState('selectedWorkItems').length).toEqual(0);

    // should have updated the work item in the section queue to have an assigneeId
    const sectionWorkQueue = integrationTest.getState('workQueue');
    const assignedWorkItem = sectionWorkQueue.find(
      workItem => workItem.workItemId === integrationTest.petitionWorkItemId,
    );
    expect(assignedWorkItem).toMatchObject({
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      section: PETITIONS_SECTION,
    });

    // the work item should appear in the individual work queue
    const workQueue = integrationTest.getState('workQueue');
    const movedWorkItem = workQueue.find(
      workItem => workItem.workItemId === integrationTest.petitionWorkItemId,
    );
    expect(movedWorkItem).toMatchObject({
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      section: PETITIONS_SECTION,
    });
  });
};
