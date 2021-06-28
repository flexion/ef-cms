import { fakeFile } from '../helpers';

export const userAddsCorrespondence = (
  integrationTest,
  correspondenceTitle,
  user,
) =>
  it(`${user} adds correspondence to case`, async () => {
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'documentTitle',
      value: correspondenceTitle,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await integrationTest.runSequence('uploadCorrespondenceDocumentSequence', {
      tab: 'correspondence',
    });

    expect(integrationTest.getState('validationErrors')).toEqual({});
    expect(integrationTest.getState('caseDetail.correspondence')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentTitle: correspondenceTitle,
        }),
      ]),
    );
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    const displayedCorrespondenceId =
      integrationTest.getState('correspondenceId');
    const mostRecentCorrespondence = integrationTest
      .getState('caseDetail.correspondence')
      .slice(-1)
      .pop();
    expect(displayedCorrespondenceId).toEqual(
      mostRecentCorrespondence.correspondenceId,
    );
  });
