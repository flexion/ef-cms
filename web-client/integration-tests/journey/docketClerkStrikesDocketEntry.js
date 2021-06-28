export const docketClerkStrikesDocketEntry = (
  integrationTest,
  docketRecordIndex,
) => {
  return it('docket clerk strikes docket entry', async () => {
    await integrationTest.runSequence('strikeDocketEntrySequence');

    const caseDocuments = integrationTest.getState('caseDetail.docketEntries');
    const strickenDocument = caseDocuments.find(
      d => d.index === docketRecordIndex,
    );

    expect(strickenDocument.isStricken).toEqual(true);
    expect(strickenDocument.strickenBy).toEqual('Test Docketclerk');
  });
};
