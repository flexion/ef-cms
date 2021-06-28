import { getFormattedDocketEntriesForTest } from '../helpers';

export const petitionsClerkServesOrder = integrationTest => {
  return it('Petitions Clerk serves the order', async () => {
    const { docketEntryId } = integrationTest;
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);

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
    await integrationTest.runSequence(
      'serveCourtIssuedDocumentFromDocketEntrySequence',
    );
  });
};
