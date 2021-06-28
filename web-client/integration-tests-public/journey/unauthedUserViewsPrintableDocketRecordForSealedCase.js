export const unauthedUserViewsPrintableDocketRecordForSealedCase =
  integrationTest => {
    return it('View printable docket record for a sealed case', async () => {
      await expect(
        integrationTest.runSequence('gotoPublicPrintableDocketRecordSequence', {
          docketNumber: integrationTest.docketNumber,
        }),
      ).rejects.toThrow('Unauthorized to view sealed case.');
    });
  };
