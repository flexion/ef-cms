export const privatePractitionerAttemptsToViewStrickenDocumentUnsuccessfully =
  integrationTest => {
    return it('private practitioner views stricken document unsuccessfully', async () => {
      await expect(
        integrationTest.runSequence('openCaseDocumentDownloadUrlSequence', {
          docketEntryId: integrationTest.docketEntryId,
          docketNumber: integrationTest.docketNumber,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time.');
    });
  };
