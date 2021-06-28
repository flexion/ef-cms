import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const petitionsClerkViewsWorkQueue = integrationTest => {
  return it('Petitions clerk views work queue', async () => {
    await integrationTest.runSequence('gotoWorkQueueSequence');
    expect(integrationTest.getState('currentPage')).toEqual('WorkQueue');
    expect(integrationTest.getState('workQueue').length).toBeGreaterThanOrEqual(
      0,
    );
    expect(integrationTest.getState('users').length).toBeGreaterThan(0);
    await integrationTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });
    const workItem = integrationTest
      .getState('workQueue')
      .find(
        workItemInQueue =>
          workItemInQueue.docketNumber === integrationTest.docketNumber &&
          workItemInQueue.docketEntry.documentType === 'Petition',
      );
    expect(workItem).toBeDefined();
    expect(workItem.caseStatus).toEqual(CASE_STATUS_TYPES.new);
    integrationTest.docketEntryId = workItem.docketEntry.docketEntryId;
    integrationTest.workItemId = workItem.workItemId;
  });
};
