import {
  getFormattedDocketEntriesForTest,
  refreshElasticsearchIndex,
} from '../helpers';

export const docketClerkServesDocument = (integrationTest, draftOrderIndex) => {
  return it(`Docket Clerk serves the order after the docket entry has been created ${draftOrderIndex}`, async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);

    const { docketEntryId } = integrationTest.draftOrders[draftOrderIndex];

    const orderDocument = formattedDocketEntriesOnDocketRecord.find(
      doc => doc.docketEntryId === docketEntryId,
    );

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

    await refreshElasticsearchIndex();
  });
};
