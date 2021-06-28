export const docketClerkNavigatesToEditDocketEntryMetaCourtIssued = (
  integrationTest,
  docketRecordIndex = 1,
) => {
  it('docket clerk navigates to page to edit docket entry meta for a court-issued document', async () => {
    await integrationTest.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: integrationTest.docketNumber,
      docketRecordIndex,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'EditDocketEntryMeta',
    );
    expect(integrationTest.getState('screenMetadata.editType')).toEqual(
      'CourtIssued',
    );
  });
};
