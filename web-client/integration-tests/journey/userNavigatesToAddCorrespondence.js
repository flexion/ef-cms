export const userNavigatesToAddCorrespondence = (integrationTest, user) =>
  it(`${user} navigates to add correspondence page`, async () => {
    await integrationTest.runSequence(
      'gotoUploadCorrespondenceDocumentSequence',
    );

    expect(integrationTest.getState('currentPage')).toEqual(
      'UploadCorrespondenceDocument',
    );
  });
