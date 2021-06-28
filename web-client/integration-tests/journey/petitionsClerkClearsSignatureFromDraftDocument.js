export const petitionsClerkClearsSignatureFromDraftDocument =
  integrationTest => {
    return it('petitions clerk clears signature on a draft document', async () => {
      await integrationTest.runSequence('setPDFSignatureDataSequence', {
        isPdfAlreadySigned: false,
        signatureApplied: false,
        signatureData: null,
      });

      expect(integrationTest.getState('pdfForSigning.signatureData')).toEqual(
        null,
      );
      expect(
        integrationTest.getState('pdfForSigning.signatureApplied'),
      ).toEqual(false);
      expect(
        integrationTest.getState('pdfForSigning.isPdfAlreadySigned'),
      ).toEqual(false);
    });
  };
