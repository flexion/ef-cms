export const docketClerkAddsDocketEntryFile = (integrationTest, fakeFile) => {
  return it('Adds a file to the current docket record form', async () => {
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFileSize',
      value: 1,
    });
  });
};
