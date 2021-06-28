export const chambersUserAppliesSignatureToDraftDocument = integrationTest => {
  return it('Chambers user applies signature to a draft document', async () => {
    expect(integrationTest.getState('pdfForSigning.nameForSigning')).toEqual(
      'John O. Colvin',
    );
    expect(
      integrationTest.getState('pdfForSigning.nameForSigningLine2'),
    ).toEqual('Judge');

    await integrationTest.runSequence('setPDFSignatureDataSequence', {
      isPdfAlreadySigned: false,
      signatureApplied: true,
      signatureData: { scale: 1, x: 20, y: 20 },
    });

    expect(
      integrationTest.getState('pdfForSigning.signatureData'),
    ).toMatchObject({
      scale: 1,
      x: 20,
      y: 20,
    });
    expect(integrationTest.getState('pdfForSigning.signatureApplied')).toEqual(
      true,
    );
    expect(
      integrationTest.getState('pdfForSigning.isPdfAlreadySigned'),
    ).toEqual(false);
  });
};
