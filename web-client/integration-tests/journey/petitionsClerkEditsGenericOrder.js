import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsClerkEditsGenericOrder = integrationTest => {
  return it('Petitions Clerk edits generic order', async () => {
    const formatted = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    const draftOrder = formatted.draftDocuments[0];

    await integrationTest.runSequence('gotoEditOrderSequence', {
      docketEntryIdToEdit: draftOrder.docketEntryId,
      docketNumber: draftOrder.docketNumber,
    });

    await integrationTest.runSequence('submitCourtIssuedOrderSequence');

    expect(integrationTest.getState('currentPage')).toEqual('SignOrder');
  });
};
