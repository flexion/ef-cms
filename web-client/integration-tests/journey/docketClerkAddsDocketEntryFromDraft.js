import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsDocketEntryFromDraft = (
  integrationTest,
  draftOrderIndex,
) => {
  return it('Docket Clerk adds a docket entry from the given draft', async () => {
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
    expect(draftOrderDocument.numberOfPages).toEqual(1);

    await integrationTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: draftOrderDocument.docketEntryId,
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'USCA',
      },
    );

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentType',
        value: 'U.S.C.A',
      },
    );

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'scenario',
        value: 'Type A',
      },
    );

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentTitle',
        value: 'U.S.C.A created by a test',
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

    await integrationTest.runSequence('submitCourtIssuedDocketEntrySequence');

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

    const numberOfPagesIncludingCoversheet =
      draftOrderDocument.numberOfPages + 1;
    const updatedDocument = caseDetailFormatted.formattedDocketEntries.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(updatedDocument.numberOfPages).toEqual(
      numberOfPagesIncludingCoversheet,
    );
  });
};
