export const unauthedUserViewsPrintableDocketRecord = integrationTest => {
  return it('View printable docket record', async () => {
    await integrationTest.runSequence(
      'gotoPublicPrintableDocketRecordSequence',
      {
        docketNumber: integrationTest.docketNumber,
      },
    );
    expect(integrationTest.getState('pdfPreviewUrl')).toBeDefined();
  });
};
