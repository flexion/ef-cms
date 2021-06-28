import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsTranscriptDocketEntryFromOrder = (
  integrationTest,
  draftOrderIndex,
  date,
) => {
  const { TRANSCRIPT_EVENT_CODE } = applicationContext.getConstants();

  return it('Docket Clerk adds a docket entry for a transcript from the given order', async () => {
    let caseDetailFormatted;

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: integrationTest.getState(),
      },
    );

    const { docketEntryId } = integrationTest.draftOrders[draftOrderIndex];

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(draftOrderDocument).toBeTruthy();

    await integrationTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: draftOrderDocument.docketEntryId,
      docketNumber: integrationTest.docketNumber,
    });

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

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'freeText',
        value: 'Anything',
      },
    );

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'month',
        value: date.month,
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'day',
        value: date.day,
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'year',
        value: date.year,
      },
    );

    const today = applicationContext.getUtilities().getMonthDayYearObj();

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'filingDateMonth',
        value: today.month,
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'filingDateDay',
        value: today.day,
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'filingDateYear',
        value: today.year,
      },
    );

    await integrationTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
    );

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    caseDetailFormatted = await runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: integrationTest.getState(),
      },
    );

    const newDocketEntry = caseDetailFormatted.formattedDocketEntries.find(
      d => d.docketEntryId === docketEntryId,
    );

    expect(newDocketEntry).toBeTruthy();
  });
};
