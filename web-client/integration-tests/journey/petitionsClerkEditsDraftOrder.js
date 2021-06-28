import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsClerkEditsDraftOrder = (
  integrationTest,
  {
    currentRichText = '<p>This is a test order.</p>',
    setRichText = '<p>This is an edited test order.</p>',
  },
) => {
  return it('Petitions Clerk edits draft order', async () => {
    const formatted = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    const draftOrder = formatted.draftDocuments[0];

    await integrationTest.runSequence('gotoEditOrderSequence', {
      docketEntryIdToEdit: draftOrder.docketEntryId,
      docketNumber: draftOrder.docketNumber,
    });

    expect(integrationTest.getState('form.richText')).toEqual(currentRichText);

    integrationTest.setState('form.richText', setRichText);
    await integrationTest.runSequence('submitCourtIssuedOrderSequence');

    await integrationTest.runSequence('gotoEditOrderSequence', {
      docketEntryIdToEdit: draftOrder.docketEntryId,
      docketNumber: draftOrder.docketNumber,
    });

    expect(integrationTest.getState('form.richText')).toEqual(setRichText);

    await integrationTest.runSequence('submitCourtIssuedOrderSequence');

    expect(integrationTest.getState('currentPage')).toEqual('SignOrder');
  });
};
