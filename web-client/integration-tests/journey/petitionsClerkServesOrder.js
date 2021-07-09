import { getFormattedDocketEntriesForTest } from '../helpers';

export const petitionsClerkServesOrder = cerebralTest => {
  return it('Petitions Clerk serves the order', async () => {
    const { docketEntryId } = test;
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const orderDocument = formattedDocketEntriesOnDocketRecord.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(orderDocument).toBeTruthy();

    await cerebralTest.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'CourtIssuedDocketEntry',
    );

    await cerebralTest.runSequence('openConfirmInitiateServiceModalSequence');
    await cerebralTest.runSequence(
      'serveCourtIssuedDocumentFromDocketEntrySequence',
    );
  });
};
