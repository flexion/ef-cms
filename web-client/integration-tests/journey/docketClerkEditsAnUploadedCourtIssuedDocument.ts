import { fakeBlob1 } from '../../../shared/src/business/test/getFakeFile';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkEditsAnUploadedCourtIssuedDocument = (
  cerebralTest,
  draftOrderIndex,
) => {
  return it('Docket Clerk edits an uploaded court issued document', async () => {
    let caseDetailFormatted;

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const { docketEntryId } = cerebralTest.draftOrders[draftOrderIndex];

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => doc.docketEntryId === docketEntryId,
    );
    expect(draftOrderDocument).toBeTruthy();

    await cerebralTest.runSequence(
      'gotoEditUploadCourtIssuedDocumentSequence',
      {
        docketEntryId: draftOrderDocument.docketEntryId,
      },
    );

    await cerebralTest.runSequence('validateUploadCourtIssuedDocumentSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('clearExistingDocumentSequence');

    await cerebralTest.runSequence('editUploadCourtIssuedDocumentSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      primaryDocumentFile: 'Upload a document',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'freeText',
      value: 'Some other content',
    });

    await cerebralTest.runSequence('validateFileInputSequence', {
      file: fakeBlob1,
      locationOnForm: 'primaryDocumentFile',
    });

    await cerebralTest.runSequence('validateUploadCourtIssuedDocumentSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('editUploadCourtIssuedDocumentSequence');

    caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const caseDraftDocuments = caseDetailFormatted.draftDocuments;
    const newDraftOrder = caseDraftDocuments.reduce((prev, current) =>
      prev.createdAt > current.createdAt ? prev : current,
    );
    expect(newDraftOrder).toBeTruthy();
    cerebralTest.draftOrders.push(newDraftOrder);
    cerebralTest.docketEntryId = newDraftOrder.docketEntryId;
  });
};
