import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkViewsAssignedWorkItemEditLink = integrationTest => {
  return it('Docket clerk views Individual Document QC - Inbox', async () => {
    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoWorkQueueSequence');
    expect(integrationTest.getState('currentPage')).toEqual('WorkQueue');
    await integrationTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const workQueueToDisplay = integrationTest.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('my');
    expect(workQueueToDisplay.box).toEqual('inbox');

    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: integrationTest.getState(),
    });

    const inboxWorkItem = workQueueFormatted.find(
      workItem =>
        workItem.docketEntry.docketEntryId === integrationTest.docketEntryId,
    );

    expect(inboxWorkItem.editLink).toContain('/edit');

    await integrationTest.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId: integrationTest.docketEntryId,
      docketNumber: integrationTest.docketNumber,
    });
  });
};
