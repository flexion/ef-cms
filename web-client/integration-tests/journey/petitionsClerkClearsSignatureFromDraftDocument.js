export default test => {
  return it('Petitions clerk applies signature to a draft document', async () => {
    await test.runSequence('setPDFSignatureDataSequence', {
      isPdfAlreadySigned: false,
      pdfjsObj: { getData: () => {} },
      signatureApplied: false,
      signatureData: null,
    });

    expect(test.getState('pdfForSigning.signatureData')).toEqual(null);
    expect(test.getState('pdfForSigning.signatureApplied')).toEqual(false);
    expect(test.getState('pdfForSigning.isPdfAlreadySigned')).toEqual(false);
  });
};
