export const userNavigatesToEditCorrespondence = (
  integrationTest,
  correspondenceTitle,
  user,
) =>
  it(`${user} navigates to edit correspondence`, async () => {
    integrationTest.correspondenceDocument = integrationTest
      .getState('caseDetail.correspondence')
      .find(
        _correspondence =>
          _correspondence.documentTitle === correspondenceTitle,
      );

    await integrationTest.runSequence(
      'gotoEditCorrespondenceDocumentSequence',
      {
        correspondenceId:
          integrationTest.correspondenceDocument.correspondenceId,
        docketNumber: integrationTest.docketNumber,
      },
    );

    expect(integrationTest.getState('currentPage')).toEqual(
      'EditCorrespondenceDocument',
    );
  });
