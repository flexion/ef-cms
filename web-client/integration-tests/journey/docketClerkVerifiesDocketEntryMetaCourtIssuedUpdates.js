export const docketClerkVerifiesDocketEntryMetaCourtIssuedUpdates = (
  integrationTest,
  docketRecordIndex = 1,
) => {
  return it('docket clerk verifies docket entry meta update for court-issued doc', async () => {
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

    expect(docketRecordEntry.documentTitle).toEqual(
      'Order for Amended Petition on 04-04-2050 be free',
    );
  });
};
