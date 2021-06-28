export const docketClerkNavigatesToEditDocketEntryMetaMinuteEntry = (
  integrationTest,
  docketRecordIndex = 2,
) => {
  it('the docketclerk navigates to page to edit docket entry meta for a minute entry', async () => {
    await integrationTest.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: integrationTest.docketNumber,
      docketRecordIndex,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'EditDocketEntryMeta',
    );
    expect(integrationTest.getState('screenMetadata.editType')).toEqual(
      'NoDocument',
    );
  });
};
