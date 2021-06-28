export const petitionsClerkSignsOrder = integrationTest => {
  return it('Petitions clerk signs order', async () => {
    await integrationTest.runSequence('gotoSignOrderSequence', {
      docketEntryId: integrationTest.docketEntryId,
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('setPDFSignatureDataSequence', {
      signatureData: {
        scale: 1,
        x: 100,
        y: 100,
      },
    });
    await integrationTest.runSequence('saveDocumentSigningSequence');
  });
};
