import { formattedDocketEntries } from '../../src/presenter/computeds/formattedDocketEntries';
import { getFormattedDocketEntriesForTest } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkAddsDocketEntryFromOrder = integrationTest => {
  return it('Petitions Clerk adds a docket entry from the given order', async () => {
    let helper;

    helper = runCompute(withAppContextDecorator(formattedDocketEntries), {
      state: integrationTest.getState(),
    });

    const { docketEntryId } = integrationTest;

    const draftOrderDocument = helper.draftDocuments.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(draftOrderDocument).toBeTruthy();

    await integrationTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: draftOrderDocument.docketEntryId,
      docketNumber: integrationTest.docketNumber,
    });

    const judges = integrationTest.getState('judges');
    expect(judges.length).toBeGreaterThan(0);

    const legacyJudge = judges.find(judge => judge.role === 'legacyJudge');
    expect(legacyJudge).toBeFalsy();

    expect(integrationTest.getState('form.eventCode')).toEqual(
      draftOrderDocument.eventCode,
    );

    expect(integrationTest.getState('form.documentType')).toEqual(
      draftOrderDocument.documentType,
    );

    await integrationTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'serviceStamp',
        value: 'Served',
      },
    );

    await integrationTest.runSequence('submitCourtIssuedDocketEntrySequence');

    expect(integrationTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
    );

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);

    const newDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === docketEntryId,
    );

    expect(newDocketEntry).toBeTruthy();
  });
};
