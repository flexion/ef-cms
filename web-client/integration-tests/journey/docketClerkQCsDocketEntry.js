import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkQCsDocketEntry = (integrationTest, data = {}) => {
  return it('Docket Clerk QCs docket entry', async () => {
    let { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);

    const lastIndex = formattedDocketEntriesOnDocketRecord.length - 1;
    data.index = data.index || lastIndex;

    const { docketEntryId } = formattedDocketEntriesOnDocketRecord[data.index];

    await integrationTest.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId,
      docketNumber: formattedDocketEntriesOnDocketRecord.docketNumber,
    });

    await integrationTest.runSequence('completeDocketEntryQCSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    ({ formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest));

    const selectedDocument = formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );

    expect(selectedDocument.qcWorkItemsCompleted).toEqual(true);
  });
};
