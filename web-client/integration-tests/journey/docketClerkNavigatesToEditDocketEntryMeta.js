export const docketClerkNavigatesToEditDocketEntryMeta = (
  integrationTest,
  docketRecordIndex = 1,
) => {
  it('the docketclerk navigates to page to edit docket entry meta', async () => {
    await integrationTest.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: integrationTest.docketNumber,
      docketRecordIndex,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'EditDocketEntryMeta',
    );
    expect(integrationTest.getState('screenMetadata.editType')).toEqual(
      'Document',
    );
  });
};
