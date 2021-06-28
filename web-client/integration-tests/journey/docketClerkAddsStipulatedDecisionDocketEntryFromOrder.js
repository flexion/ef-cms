import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsStipulatedDecisionDocketEntryFromOrder = (
  integrationTest,
  draftOrderIndex,
) => {
  const { STIPULATED_DECISION_EVENT_CODE } = applicationContext.getConstants();

  return it('Docket Clerk adds a docket entry for a stipulated decision from the given order', async () => {
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
        value: STIPULATED_DECISION_EVENT_CODE,
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentType',
        value: 'Stipulated Decision',
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentTitle',
        value: 'Stipulated Decision Entered, [Judge Name] [Anything]',
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'scenario',
        value: 'Type B',
      },
    );

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'judge',
        value: 'Ashford',
      },
    );
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'freeText',
        value: 'Anything',
      },
    );

    expect(integrationTest.getState('form.generatedDocumentTitle')).toContain(
      'Judge Ashford Anything',
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
