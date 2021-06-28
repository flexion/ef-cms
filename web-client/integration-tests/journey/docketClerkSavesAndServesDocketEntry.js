import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkSavesAndServesDocketEntry = integrationTest => {
  return it('Docketclerk saves and serves a docket entry', async () => {
    await integrationTest.runSequence('submitPaperFilingSequence');

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);

    integrationTest.docketRecordEntry =
      formattedDocketEntriesOnDocketRecord.find(
        entry => entry.eventCode === 'ADMR',
      );

    expect(integrationTest.docketRecordEntry.index).toBeTruthy();
  });
};
