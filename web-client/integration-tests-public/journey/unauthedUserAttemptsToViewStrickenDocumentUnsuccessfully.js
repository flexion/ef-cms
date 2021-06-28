export const unauthedUserAttemptsToViewStrickenDocumentUnsuccessfully =
  integrationTest => {
    return it('View stricken document unsuccessfully', async () => {
      await expect(
        integrationTest.runSequence('openCaseDocumentDownloadUrlSequence', {
          docketEntryId: integrationTest.docketEntryId,
          docketNumber: integrationTest.docketNumber,
          isPublic: true,
        }),
      ).rejects.toThrow('Unauthorized to access private document');
    });
  };
