import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const petitionsClerkAddsDocketEntryForOrderAndSavesForLater =
  integrationTest => {
    return it('Petitions clerk adds docket entry for order and saves for later', async () => {
      await integrationTest.runSequence(
        'gotoAddCourtIssuedDocketEntrySequence',
        {
          docketEntryId: integrationTest.docketEntryId,
          docketNumber: integrationTest.docketNumber,
        },
      );

      expect(integrationTest.getState('currentPage')).toEqual(
        'CourtIssuedDocketEntry',
      );
      expect(integrationTest.getState('form.freeText')).toEqual(
        integrationTest.freeText,
      );

      await integrationTest.runSequence('submitCourtIssuedDocketEntrySequence');

      expect(integrationTest.getState('validationErrors')).toEqual({});

      expect(integrationTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );

      await refreshElasticsearchIndex();

      await integrationTest.runSequence('gotoWorkQueueSequence');
      expect(integrationTest.getState('currentPage')).toEqual('WorkQueue');
      await integrationTest.runSequence('chooseWorkQueueSequence', {
        box: 'inProgress',
        queue: 'my',
      });

      const workQueueToDisplay = integrationTest.getState('workQueueToDisplay');

      expect(workQueueToDisplay.queue).toEqual('my');
      expect(workQueueToDisplay.box).toEqual('inProgress');

      const workQueueFormatted = runCompute(formattedWorkQueue, {
        state: integrationTest.getState(),
      });
      const inboxWorkItem = workQueueFormatted.find(
        workItem => workItem.docketNumber === integrationTest.docketNumber,
      );

      expect(inboxWorkItem).toMatchObject({
        docketEntry: {
          documentTitle: 'Order to keep the free text',
        },
        editLink: `/case-detail/${integrationTest.docketNumber}/document-view?docketEntryId=${inboxWorkItem.docketEntry.docketEntryId}`,
        inProgress: true,
      });
    });
  };
