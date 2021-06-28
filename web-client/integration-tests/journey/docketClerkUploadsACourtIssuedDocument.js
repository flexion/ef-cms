import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkUploadsACourtIssuedDocument = (
  integrationTest,
  fakeFile,
) => {
  return it('Docket Clerk uploads a court issued document', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('gotoUploadCourtIssuedDocumentSequence');

    await integrationTest.runSequence('uploadCourtIssuedDocumentSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      freeText: 'Enter a description',
      primaryDocumentFile: 'Upload a document',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'freeText',
      value: 'Some order content',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });
    await integrationTest.runSequence(
      'validateUploadCourtIssuedDocumentSequence',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('uploadCourtIssuedDocumentSequence');

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: integrationTest.getState(),
      },
    );

    const caseDraftDocuments = caseDetailFormatted.draftDocuments;
    const newDraftOrder = caseDraftDocuments.reduce((prev, current) =>
      prev.createdAt > current.createdAt ? prev : current,
    );
    expect(newDraftOrder).toBeTruthy();
    integrationTest.draftOrders.push(newDraftOrder);
  });
};
