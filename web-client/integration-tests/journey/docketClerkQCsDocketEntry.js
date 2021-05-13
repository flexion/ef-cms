import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkQCsDocketEntry = (test, data = {}) => {
  return it('Docket Clerk QCs docket entry', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    let {
      formattedDocketEntriesOnDocketRecord,
    } = await getFormattedDocketEntriesForTest(test);

    const lastIndex = formattedDocketEntriesOnDocketRecord.length - 1;
    data.index = data.index || lastIndex;

    const { docketEntryId } = formattedDocketEntriesOnDocketRecord[data.index];

    await test.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId,
      docketNumber: formattedDocketEntriesOnDocketRecord.docketNumber,
    });

    await test.runSequence('completeDocketEntryQCSequence');

    expect(test.getState('validationErrors')).toEqual({});

    ({
      formattedDocketEntriesOnDocketRecord,
    } = await getFormattedDocketEntriesForTest(test));

    const selectedDocument = formattedDocketEntriesOnDocketRecord.formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );

    expect(selectedDocument.qcWorkItemsCompleted).toEqual(true);
  });
};
