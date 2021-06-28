import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkAssignWorkItemToSelf = integrationTest => {
  return it('Docket clerk assigns the selected work items to self', async () => {
    await refreshElasticsearchIndex();

    await integrationTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });
    let sectionWorkQueue = integrationTest.getState('workQueue');

    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: integrationTest.getState(),
    });

    const selectedWorkItem = workQueueFormatted.find(
      workItem => workItem.docketNumber === integrationTest.docketNumber,
    );

    integrationTest.docketEntryId = selectedWorkItem.docketEntry.docketEntryId;

    expect(selectedWorkItem).toMatchObject({
      assigneeId: null,
    });

    integrationTest.setState('selectedWorkItems', [selectedWorkItem]);
    integrationTest.setState('assigneeName', 'Test Docketclerk');
    integrationTest.setState(
      'assigneeId',
      '1805d1ab-18d0-43ec-bafb-654e83405416',
    );

    await integrationTest.runSequence('assignSelectedWorkItemsSequence');

    sectionWorkQueue = integrationTest.getState('workQueue');
    const assignedSelectedWorkItem = sectionWorkQueue.find(
      workItem => workItem.workItemId === selectedWorkItem.workItemId,
    );
    expect(assignedSelectedWorkItem).toMatchObject({
      assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });
};
