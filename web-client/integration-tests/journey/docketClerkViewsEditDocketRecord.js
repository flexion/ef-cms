export const docketClerkViewsEditDocketRecord = integrationTest => {
  return it('Docket clerk views Edit Docket Record', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('gotoEditPaperFilingSequence', {
      docketEntryId: integrationTest.docketRecordEntry.docketEntryId,
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual('PaperFiling');
  });
};
