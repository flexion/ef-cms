export const docketClerkSignsOrder = (integrationTest, draftOrderIndex) => {
  return it('Docket clerk signs order', async () => {
    const { docketEntryId } = integrationTest.draftOrders[draftOrderIndex];

    await integrationTest.runSequence('gotoSignOrderSequence', {
      docketEntryId,
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
