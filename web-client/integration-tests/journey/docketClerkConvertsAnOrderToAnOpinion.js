import { VALIDATION_ERROR_MESSAGES } from '../../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkConvertsAnOrderToAnOpinion = (
  integrationTest,
  draftOrderIndex,
) => {
  return it(`Docket Clerk edits a docket entry from the given order ${draftOrderIndex} with nonstandard type B`, async () => {
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

    // Type B
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'TCOP',
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentType',
        value: 'T.C. Opinion',
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentTitle',
        value: 'T.C. Opinion [judge] [anything]',
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'scenario',
        value: 'Type B',
      },
    );

    await integrationTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      judge: VALIDATION_ERROR_MESSAGES.judge,
    });

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'judge',
        value: 'Judge Pugh',
      },
    );

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'freeText',
        value: 'freeeeee text',
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
      documentTitle: 'T.C. Opinion Judge Pugh freeeeee text',
      documentType: 'T.C. Opinion',
      eventCode: 'TCOP',
      freeText: 'freeeeee text',
      judge: 'Judge Pugh',
    });

    await integrationTest.runSequence(
      'gotoEditCourtIssuedDocketEntrySequence',
      {
        docketEntryId: orderDocument.docketEntryId,
        docketNumber: integrationTest.docketNumber,
      },
    );

    expect(integrationTest.getState('form')).toMatchObject({
      documentTitle: 'T.C. Opinion Judge Pugh freeeeee text',
      documentType: 'T.C. Opinion',
      eventCode: 'TCOP',
      freeText: 'freeeeee text',
      generatedDocumentTitle: 'T.C. Opinion Judge Pugh freeeeee text',
      judge: 'Judge Pugh',
    });
  });
};
