export const petitionsClerkSavesSignatureForDraftDocument = (
  integrationTest,
  title,
) => {
  return it('Petitions clerk saves signature for draft document', async () => {
    await integrationTest.runSequence('saveDocumentSigningSequence', {
      gotoAfterSigning: 'DocumentDetail',
    });

    expect(integrationTest.getState('draftDocumentViewerDocketEntryId')).toBe(
      integrationTest.docketEntryId,
    );
    expect(integrationTest.getState('alertSuccess.message')).toEqual(title);
  });
};
