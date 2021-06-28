import { addCourtIssuedDocketEntryNonstandardHelper } from '../../src/presenter/computeds/addCourtIssuedDocketEntryNonstandardHelper';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsDocketEntryFromOrderOfDismissal = (
  integrationTest,
  draftOrderIndex,
) => {
  return it('Docket Clerk adds a docket entry from an Order of Dismissal', async () => {
    let caseDetailFormatted;
    let helperComputed;

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

    helperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: integrationTest.getState(),
      },
    );

    expect(integrationTest.getState('form.eventCode')).toEqual('OD');
    expect(integrationTest.getState('form.documentType')).toEqual(
      'Order of Dismissal',
    );
    expect(helperComputed.showJudge).toBeTruthy();
    expect(integrationTest.getState('form.judge')).toBeFalsy();
    expect(helperComputed.showFreeText).toBeTruthy();
    expect(integrationTest.getState('form.freeText')).toBeFalsy();

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'judge',
        value: 'Buch',
      },
    );

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'freeText',
        value: 'for Something',
      },
    );

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'attachments',
        value: true,
      },
    );

    expect(integrationTest.getState('form.generatedDocumentTitle')).toContain(
      'Judge Buch for Something',
    );

    await integrationTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(integrationTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
    );

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: integrationTest.getState(),
      },
    );

    const newDocketEntry = caseDetailFormatted.formattedDocketEntries.find(
      entry => entry && entry.docketEntryId === docketEntryId,
    );

    expect(newDocketEntry).toBeTruthy();
    expect(
      `${newDocketEntry.documentTitle} ${newDocketEntry.filingsAndProceedings}`,
    ).toEqual(
      'Order of Dismissal Entered, Judge Buch for Something (Attachment(s))',
    );
  });
};
