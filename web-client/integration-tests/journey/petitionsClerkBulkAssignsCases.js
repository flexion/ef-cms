import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const petitionsClerkBulkAssignsCases = (
  integrationTest,
  createdCases,
) => {
  return it('Petitions clerk bulk assigns cases', async () => {
    const workQueueFormatted = await runCompute(formattedWorkQueue, {
      state: integrationTest.getState(),
    });

    const selectedWorkItems = createdCases.map(newCase => {
      const workItem = workQueueFormatted.find(
        w => w.docketNumber === newCase.docketNumber,
      );

      return {
        workItemId: workItem.workItemId,
      };
    });

    const currentUserId = integrationTest.getState('user').userId;

    integrationTest.setState('assigneeId', currentUserId);
    integrationTest.setState('assigneeName', 'Petitions Clerk1');
    integrationTest.setState('selectedWorkItems', selectedWorkItems);

    const result = await integrationTest.runSequence(
      'assignSelectedWorkItemsSequence',
    );

    const { workQueue } = result.state;
    selectedWorkItems.forEach(assignedWorkItem => {
      const workItem = workQueue.find(
        item => (item.workItemId = assignedWorkItem.workItemId),
      );

      expect(workItem.assigneeId).toEqual(currentUserId);
    });
  });
};
