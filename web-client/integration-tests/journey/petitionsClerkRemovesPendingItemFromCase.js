export const petitionsClerkRemovesPendingItemFromCase = integrationTest => {
  return it('Petitions Clerk removes a pending item from a case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const documents = integrationTest.getState('caseDetail.docketEntries');

    const pendingDocument = documents.find(
      document => document.pending === true,
    );

    await integrationTest.runSequence(
      'openConfirmRemoveCaseDetailPendingItemModalSequence',
      {
        docketEntryId: pendingDocument.docketEntryId,
      },
    );

    await integrationTest.runSequence('removeCaseDetailPendingItemSequence');
  });
};
