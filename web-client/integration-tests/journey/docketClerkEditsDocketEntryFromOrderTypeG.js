import { VALIDATION_ERROR_MESSAGES } from '../../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkEditsDocketEntryFromOrderTypeG = (
  integrationTest,
  draftOrderIndex,
) => {
  return it(`Docket Clerk edits a docket entry from the given order ${draftOrderIndex} with nonstandard type G`, async () => {
    const { docketEntryId } = integrationTest.draftOrders[draftOrderIndex];

    let { formattedDocketEntriesOnDocketRecord } =
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

    // Type G
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'NTD',
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentType',
        value: 'Notice of Trial',
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentTitle',
        value: 'Notice of Trial on [Date] at [Place]',
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'scenario',
        value: 'Type G',
      },
    );

    expect(integrationTest.getState('form.trialLocation')).toBeUndefined();

    await integrationTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      date: VALIDATION_ERROR_MESSAGES.date[2],
      trialLocation: VALIDATION_ERROR_MESSAGES.trialLocation,
    });

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'month',
        value: '1',
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'day',
        value: '1',
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'year',
        value: '2002',
      },
    );

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'trialLocation',
        value: 'Boise, Idaho',
      },
    );

    await integrationTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    ({ formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest));

    const updatedOrderDocument = formattedDocketEntriesOnDocketRecord.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(updatedOrderDocument).toMatchObject({
      date: '2002-01-01T05:00:00.000Z',
      documentTitle: 'Notice of Trial on 01-01-2002 at Boise, Idaho',
      documentType: 'Notice of Trial',
      eventCode: 'NTD',
      trialLocation: 'Boise, Idaho',
    });

    await integrationTest.runSequence(
      'gotoEditCourtIssuedDocketEntrySequence',
      {
        docketEntryId: orderDocument.docketEntryId,
        docketNumber: integrationTest.docketNumber,
      },
    );

    expect(integrationTest.getState('form')).toMatchObject({
      date: '2002-01-01T05:00:00.000Z',
      day: '1',
      documentTitle: 'Notice of Trial on 01-01-2002 at Boise, Idaho',
      documentType: 'Notice of Trial',
      eventCode: 'NTD',
      generatedDocumentTitle: 'Notice of Trial on 01-01-2002 at Boise, Idaho',
      month: '1',
      trialLocation: 'Boise, Idaho',
      year: '2002',
    });
  });
};
