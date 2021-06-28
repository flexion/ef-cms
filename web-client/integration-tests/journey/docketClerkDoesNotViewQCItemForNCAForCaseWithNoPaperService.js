import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { contactPrimaryFromState } from '../helpers';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkDoesNotViewQCItemForNCAForCaseWithNoPaperService =
  integrationTest => {
    return it('Docket Clerk does not view QC item for NCA for case with no paper service', async () => {
      const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

      integrationTest.setState('caseDetail', {});
      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: integrationTest.docketNumber,
      });
      expect(integrationTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );

      const caseWithNoPaperService = integrationTest.getState('caseDetail');

      const contactPrimary = contactPrimaryFromState(integrationTest);

      expect(contactPrimary.serviceIndicator).not.toEqual(
        SERVICE_INDICATOR_TYPES.SI_PAPER,
      );
      expect(
        caseWithNoPaperService.privatePractitioners[0].serviceIndicator,
      ).not.toEqual(SERVICE_INDICATOR_TYPES.SI_PAPER);

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
