export const userDeletesCorrespondence = (
  integrationTest,
  correspondenceTitle,
  user,
) =>
  it(`${user} deletes correspondence`, async () => {
    await integrationTest.runSequence(
      'openConfirmDeleteCorrespondenceModalSequence',
      {
        correspondenceId:
          integrationTest.correspondenceDocument.correspondenceId,
        documentTitle: correspondenceTitle,
      },
    );

    expect(integrationTest.getState('modal.showModal')).toEqual(
      'DeleteCorrespondenceModal',
    );

    await integrationTest.runSequence('deleteCorrespondenceDocumentSequence');

    const deletedCorrespondence = integrationTest
      .getState('caseDetail.correspondence')
      .find(
        c =>
          c.correspondenceId ===
          integrationTest.correspondenceDocument.correspondenceId,
      );
    expect(deletedCorrespondence).toBeUndefined();
  });
