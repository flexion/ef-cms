import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { getFakeBlob } from '../../../shared/src/business/test/getFakeFile';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkUploadsACourtIssuedDocument = cerebralTest => {
  return it('Docket Clerk uploads a court issued document', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoUploadCourtIssuedDocumentSequence');

    await cerebralTest.runSequence('uploadCourtIssuedDocumentSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      freeText: 'Enter a description',
      primaryDocumentFile: 'Upload a document',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'freeText',
      value: 'Some order content',
    });

    await cerebralTest.runSequence('validateFileInputSequence', {
      file: getFakeBlob(),
      theNameOfTheFileOnTheEntity: 'primaryDocumentFile',
    });

    await cerebralTest.runSequence('validateUploadCourtIssuedDocumentSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('uploadCourtIssuedDocumentSequence');

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const caseDraftDocuments = caseDetailFormatted.draftDocuments;
    const newDraftOrder = caseDraftDocuments.reduce((prev, current) =>
      prev.createdAt > current.createdAt ? prev : current,
    );

    cerebralTest.docketEntryId = newDraftOrder.docketEntryId;

    expect(newDraftOrder).toBeTruthy();
    cerebralTest.draftOrders = [
      ...(cerebralTest.draftOrders || []),
      newDraftOrder,
    ];
  });
};
