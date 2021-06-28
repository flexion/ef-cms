import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkDoesNotViewQCItemForNCAForRepresentedPetitioner =
  integrationTest => {
    return it('Docket Clerk does not view QC item for NCA for represented petitioner', async () => {
      await integrationTest.runSequence('chooseWorkQueueSequence', {
        box: 'inbox',
        queue: 'section',
      });
      const workQueueFormatted = runCompute(formattedWorkQueue, {
        state: integrationTest.getState(),
      });

      const noticeOfChangeOfAddressQCItem = workQueueFormatted.find(
        workItem => workItem.docketNumber === integrationTest.docketNumber,
      );

      expect(noticeOfChangeOfAddressQCItem).toBeUndefined();
    });
  };
