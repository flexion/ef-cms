import { addCourtIssuedDocketEntryHelper } from '../../src/presenter/computeds/addCourtIssuedDocketEntryHelper';
import { addCourtIssuedDocketEntryNonstandardHelper } from '../../src/presenter/computeds/addCourtIssuedDocketEntryNonstandardHelper';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkAddsDocketEntryFromOrder = (
  integrationTest,
  draftOrderIndex,
) => {
  return it(`Docket Clerk adds a docket entry from the given order ${draftOrderIndex}`, async () => {
    let caseDetailFormatted;
    let nonstandardHelperComputed;
    let addCourtIssuedDocketEntryHelperComputed;

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: integrationTest.getState(),
      },
    );

    const { docketEntryId } = integrationTest.draftOrders[draftOrderIndex];
    integrationTest.docketEntryId = docketEntryId;

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(draftOrderDocument).toBeTruthy();

    await integrationTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: draftOrderDocument.docketEntryId,
      docketNumber: integrationTest.docketNumber,
    });

    // default
    expect(integrationTest.getState('form.eventCode')).toEqual(
      draftOrderDocument.eventCode,
    );

    expect(integrationTest.getState('form.documentType')).toEqual(
      draftOrderDocument.documentType,
    );

    // eventCode: O
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'O',
      },
    );

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: integrationTest.getState(),
      },
    );

    addCourtIssuedDocketEntryHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryHelper),
      {
        state: integrationTest.getState(),
      },
    );

    expect(
      addCourtIssuedDocketEntryHelperComputed.showServiceStamp,
    ).toBeTruthy();
    expect(nonstandardHelperComputed.showFreeText).toBeTruthy();
    expect(integrationTest.getState('form.freeText')).toEqual('Order');
    expect(integrationTest.getState('form.serviceStamp')).toBeFalsy();

    // eventCode: OCA
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'OCA',
      },
    );

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: integrationTest.getState(),
      },
    );

    expect(nonstandardHelperComputed.showFreeText).toBeTruthy();
    expect(integrationTest.getState('form.freeText')).toBeFalsy();

    // eventCode: OAJ
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'OAJ',
      },
    );

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: integrationTest.getState(),
      },
    );

    expect(nonstandardHelperComputed.showFreeText).toBeTruthy();
    expect(integrationTest.getState('form.freeText')).toBeFalsy();
    expect(nonstandardHelperComputed.showJudge).toBeTruthy();
    expect(integrationTest.getState('form.judge')).toBeFalsy();

    // eventCode: OAL
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'OAL',
      },
    );

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: integrationTest.getState(),
      },
    );

    expect(nonstandardHelperComputed.showFreeText).toBeFalsy();
    expect(nonstandardHelperComputed.showDocketNumbers).toBeTruthy();
    expect(integrationTest.getState('form.docketNumbers')).toBeFalsy();

    // eventCode: OAP
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'OAP',
      },
    );

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: integrationTest.getState(),
      },
    );

    expect(nonstandardHelperComputed.showFreeText).toBeTruthy();
    expect(integrationTest.getState('form.freeText')).toBeFalsy();
    expect(nonstandardHelperComputed.showDateFirst).toBeTruthy();
    expect(integrationTest.getState('form.month')).toBeFalsy();
    expect(integrationTest.getState('form.day')).toBeFalsy();
    expect(integrationTest.getState('form.year')).toBeFalsy();

    // eventCode: OODS
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'OODS',
      },
    );

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: integrationTest.getState(),
      },
    );

    expect(nonstandardHelperComputed.showFreeText).toBeFalsy();
    expect(nonstandardHelperComputed.showDateFirst).toBeTruthy();
    expect(integrationTest.getState('form.month')).toBeFalsy();
    expect(integrationTest.getState('form.day')).toBeFalsy();
    expect(integrationTest.getState('form.year')).toBeFalsy();

    // test defined
    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: draftOrderDocument.eventCode,
      },
    );

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'freeText',
        value: draftOrderDocument.freeText,
      },
    );

    if (draftOrderDocument.eventCode === 'O') {
      await integrationTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key: 'serviceStamp',
          value: 'Served',
        },
      );
    }

    nonstandardHelperComputed = runCompute(
      withAppContextDecorator(addCourtIssuedDocketEntryNonstandardHelper),
      {
        state: integrationTest.getState(),
      },
    );

    expect(integrationTest.getState('form.eventCode')).toEqual(
      draftOrderDocument.eventCode,
    );

    expect(integrationTest.getState('form.documentType')).toEqual(
      draftOrderDocument.documentType,
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

    const newDocketEntry = caseDetailFormatted.formattedDocketEntries.find(
      entry => entry.docketEntryId === docketEntryId && entry.isOnDocketRecord,
    );

    integrationTest.docketRecordEntry = newDocketEntry;

    expect(newDocketEntry).toBeTruthy();
    expect(newDocketEntry.index).toBeFalsy();
  });
};
