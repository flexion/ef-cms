import { VALIDATION_ERROR_MESSAGES } from '../../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkEditsDocketEntryFromOrderTypeH = (
  integrationTest,
  draftOrderIndex,
) => {
  const { TRANSCRIPT_EVENT_CODE } = applicationContext.getConstants();

  return it(`Docket Clerk edits a docket entry from the given order ${draftOrderIndex} with nonstandard type H`, async () => {
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

    // Type H
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: TRANSCRIPT_EVENT_CODE,
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'filingDateMonth',
        value: '1',
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'filingDateDay',
        value: '1',
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'filingDateYear',
        value: '2021',
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentType',
        value: 'Transcript',
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentTitle',
        value: 'Transcript of [anything] on [date]',
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'scenario',
        value: 'Type H',
      },
    );

    expect(integrationTest.getState('form.trialLocation')).toBeUndefined();

    await integrationTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      date: VALIDATION_ERROR_MESSAGES.date[2],
      freeText: VALIDATION_ERROR_MESSAGES.freeText[0].message,
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
        value: '2050',
      },
    );

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'freeText',
        value: 'this is free text',
      },
    );

    await integrationTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      date: VALIDATION_ERROR_MESSAGES.date[1].message,
    });

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'year',
        value: '2018',
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
      date: '2018-01-01T05:00:00.000Z',
      documentTitle: 'Transcript of this is free text on 01-01-2018',
      documentType: 'Transcript',
      eventCode: TRANSCRIPT_EVENT_CODE,
      freeText: 'this is free text',
    });

    await integrationTest.runSequence(
      'gotoEditCourtIssuedDocketEntrySequence',
      {
        docketEntryId: orderDocument.docketEntryId,
        docketNumber: integrationTest.docketNumber,
      },
    );

    expect(integrationTest.getState('form')).toMatchObject({
      date: '2018-01-01T05:00:00.000Z',
      day: '1',
      documentTitle: 'Transcript of this is free text on 01-01-2018',
      documentType: 'Transcript',
      eventCode: TRANSCRIPT_EVENT_CODE,
      freeText: 'this is free text',
      generatedDocumentTitle: 'Transcript of this is free text on 01-01-2018',
      month: '1',
      year: '2018',
    });
  });
};
