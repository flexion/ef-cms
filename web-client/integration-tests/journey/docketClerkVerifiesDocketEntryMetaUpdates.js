export const docketClerkVerifiesDocketEntryMetaUpdates = (
  integrationTest,
  docketRecordIndex = 1,
) => {
  return it('docket clerk verifies docket entry meta update', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    const caseDetail = integrationTest.getState('caseDetail');
    const docketRecordEntry = caseDetail.docketEntries.find(
      entry => entry.index === docketRecordIndex,
    );

    expect(docketRecordEntry.filingDate).toEqual('2020-01-04T05:00:00.000Z');
    expect(docketRecordEntry.filedBy).toEqual(
      'Resp. & Petr. Mona Schultz, Brianna Noble',
    );
    expect(docketRecordEntry.documentTitle).toEqual(
      'First Request for Admissions',
    );
  });
};
