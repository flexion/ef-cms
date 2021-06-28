import { confirmInitiateServiceModalHelper } from '../../src/presenter/computeds/confirmInitiateServiceModalHelper';
import { getFormattedDocketEntriesForTest } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkServesOrderOnPaperParties = (
  integrationTest,
  draftOrderIndex,
) => {
  return it('Docket Clerk serves the order on 3 parties with paper service', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);

    const { docketEntryId } = integrationTest.draftOrders[draftOrderIndex];

    const orderDocument = formattedDocketEntriesOnDocketRecord.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(orderDocument).toBeTruthy();

    await integrationTest.runSequence(
      'gotoEditCourtIssuedDocketEntrySequence',
      {
        docketEntryId: orderDocument.docketEntryId,
        docketNumber: integrationTest.docketNumber,
      },
    );

    expect(integrationTest.getState('currentPage')).toEqual(
      'CourtIssuedDocketEntry',
    );

    await integrationTest.runSequence(
      'openConfirmInitiateServiceModalSequence',
    );

    const modalHelper = runCompute(
      withAppContextDecorator(confirmInitiateServiceModalHelper),
      {
        state: integrationTest.getState(),
      },
    );

    expect(modalHelper.showPaperAlert).toEqual(true);

    expect(modalHelper.contactsNeedingPaperService.length).toEqual(2);

    await integrationTest.runSequence(
      'serveCourtIssuedDocumentFromDocketEntrySequence',
    );
  });
};
