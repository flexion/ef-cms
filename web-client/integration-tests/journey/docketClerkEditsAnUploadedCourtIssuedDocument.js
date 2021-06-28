import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkEditsAnUploadedCourtIssuedDocument = (
  integrationTest,
  fakeFile,
  draftOrderIndex,
) => {
  return it('Docket Clerk edits an uploaded court issued document', async () => {
    let caseDetailFormatted;

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: integrationTest.getState(),
      },
    );

    const { docketEntryId } = integrationTest.draftOrders[draftOrderIndex];

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => doc.docketEntryId === docketEntryId,
    );
    expect(draftOrderDocument).toBeTruthy();

    await integrationTest.runSequence(
      'gotoEditUploadCourtIssuedDocumentSequence',
      {
        docketEntryId: draftOrderDocument.docketEntryId,
      },
    );

    await integrationTest.runSequence(
      'validateUploadCourtIssuedDocumentSequence',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('clearExistingDocumentSequence');

    await integrationTest.runSequence('editUploadCourtIssuedDocumentSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      primaryDocumentFile: 'Upload a document',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'freeText',
      value: 'Some other content',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });
    await integrationTest.runSequence(
      'validateUploadCourtIssuedDocumentSequence',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('editUploadCourtIssuedDocumentSequence');

    caseDetailFormatted = runCompute(
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
    integrationTest.docketEntryId = newDraftOrder.docketEntryId;
  });
};
