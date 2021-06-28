import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const petitionsClerkViewsSectionInProgress = integrationTest => {
  return it('Petitions Clerk views section inProgress', async () => {
    await integrationTest.runSequence('gotoWorkQueueSequence');
    expect(integrationTest.getState('currentPage')).toEqual('WorkQueue');
    await integrationTest.runSequence('chooseWorkQueueSequence', {
      box: 'inProgress',
      queue: 'section',
    });

    const workQueueToDisplay = integrationTest.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('section');
    expect(workQueueToDisplay.box).toEqual('inProgress');

    const formattedWorkItem = runCompute(formattedWorkQueue, {
      state: integrationTest.getState(),
    }).find(item => item.docketNumber === integrationTest.docketNumber);

    expect(formattedWorkItem.editLink).toContain('/review');
  });
};
