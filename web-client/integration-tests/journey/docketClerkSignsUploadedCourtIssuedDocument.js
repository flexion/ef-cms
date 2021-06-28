export const docketClerkSignsUploadedCourtIssuedDocument = integrationTest => {
  return it('Docket Clerk signs an uploaded court issued document', async () => {
    await integrationTest.runSequence('gotoSignOrderSequence', {
      docketEntryId: integrationTest.docketEntryId,
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual('SignOrder');

    await integrationTest.runSequence('setPDFSignatureDataSequence', {
      signatureData: {
        scale: 1,
        x: 100,
        y: 100,
      },
    });
    await integrationTest.runSequence('saveDocumentSigningSequence');

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    const caseDocument = integrationTest
      .getState('caseDetail.docketEntries')
      .find(d => d.docketEntryId === integrationTest.docketEntryId);

    expect(caseDocument.signedAt).toBeTruthy();
  });
};
