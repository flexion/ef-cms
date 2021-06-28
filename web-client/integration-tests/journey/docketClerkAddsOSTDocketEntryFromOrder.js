import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsOSTDocketEntryFromOrder = (
  integrationTest,
  draftOrderIndex,
) => {
  return it(`Docket Clerk adds a docket entry from the given order ${draftOrderIndex} with the OST event code`, async () => {
    const caseDetailFormatted = runCompute(
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

    const updateKeyValues = {
      documentTitle:
        'Order of Service of Transcript (Bench Opinion) [Anything]',
      documentType: 'Order of Service of Transcript (Bench Opinion)',
      eventCode: 'OST',
      scenario: 'Type A',
    };

    for (let [key, value] of Object.entries(updateKeyValues)) {
      await integrationTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key,
          value,
        },
      );
    }

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'freeText',
        value: 'something',
      },
    );

    await integrationTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
    );
  });
};
