import { getPetitionWorkItemForCase } from '../helpers';

export const petitionsClerkVerifiesAssignedWorkItem = (
  integrationTest,
  createdCases,
) => {
  return it('Petitions clerk verifies assignment of work item', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: createdCases[0].docketNumber,
    });

    const { workItemId } = getPetitionWorkItemForCase(
      integrationTest.getState('caseDetail'),
    );

    await integrationTest.runSequence('gotoWorkQueueSequence');
    expect(integrationTest.getState('currentPage')).toEqual('WorkQueue');
    const workItem = integrationTest
      .getState('workQueue')
      .find(workItemInQueue => workItemInQueue.workItemId === workItemId);
    expect(workItem).toBeDefined();
  });
};
