export const chambersUserViewsSignDraftDocument = integrationTest => {
  return it('Chambers user views sign draft document', async () => {
    await integrationTest.runSequence('gotoSignOrderSequence', {
      docketEntryId: integrationTest.docketEntryId,
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual('SignOrder');
  });
};
