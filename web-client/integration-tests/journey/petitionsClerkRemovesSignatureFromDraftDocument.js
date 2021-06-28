export const petitionsClerkRemovesSignatureFromDraftDocument =
  integrationTest => {
    return it('Petitions clerk removes saved signature from draft document', async () => {
      await integrationTest.runSequence(
        'openConfirmRemoveSignatureModalSequence',
        {
          docketEntryIdToEdit: integrationTest.docketEntryId,
        },
      );

      await integrationTest.runSequence('removeSignatureSequence');

      expect(integrationTest.getState('alertSuccess.message')).toEqual(
        'Signature removed.',
      );
    });
  };
