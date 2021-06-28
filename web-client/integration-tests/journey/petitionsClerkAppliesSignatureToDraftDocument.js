export const petitionsClerkAppliesSignatureToDraftDocument =
  integrationTest => {
    return it('Petitions clerk applies signature to a draft document', async () => {
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
      expect(
        integrationTest.getState('pdfForSigning.signatureApplied'),
      ).toEqual(true);
      expect(
        integrationTest.getState('pdfForSigning.isPdfAlreadySigned'),
      ).toEqual(false);
    });
  };
