import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkViewsSavedCourtIssuedDocketEntryInProgress = (
  integrationTest,
  draftOrderIndex,
) => {
  return it('Docket Clerk views an in-progress docket entry for the given court-issued document', async () => {
    const { docketEntryId } = integrationTest.draftOrders[draftOrderIndex];
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);

    const orderDocument = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === docketEntryId,
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
    expect(integrationTest.getState('isEditingDocketEntry')).toBeTruthy();
    expect(integrationTest.getState('form.eventCode')).toEqual(
      orderDocument.eventCode,
    );
  });
};
