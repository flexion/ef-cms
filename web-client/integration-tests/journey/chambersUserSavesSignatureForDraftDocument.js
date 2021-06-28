export const chambersUserSavesSignatureForDraftDocument = integrationTest => {
  return it('Chambers user saves signature for draft document', async () => {
    await integrationTest.runSequence('saveDocumentSigningSequence', {
      gotoAfterSigning: 'DocumentDetail',
    });

    expect(integrationTest.getState('alertSuccess.message')).toEqual(
      'Order of Dismissal and Decision updated.',
    );
  });
};
