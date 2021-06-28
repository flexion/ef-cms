import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsDeletesOrderFromCase = integrationTest => {
  return it('Petitions clerk deletes Order from case', async () => {
    let formatted = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    const draftOrder = formatted.draftDocuments[0];

    await integrationTest.runSequence('archiveDraftDocumentModalSequence', {
      docketEntryId: draftOrder.docketEntryId,
      docketNumber: draftOrder.docketNumber,
      documentTitle: draftOrder.documentTitle,
      redirectToCaseDetail: true,
    });

    await integrationTest.runSequence('archiveDraftDocumentSequence');

    formatted = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    expect(integrationTest.getState('alertSuccess.message')).toEqual(
      'Document deleted.',
    );
    expect(
      integrationTest.getState('viewerDraftDocumentToDisplay'),
    ).toBeUndefined();
    expect(
      integrationTest.getState('draftDocumentViewerDocketEntryId'),
    ).toBeUndefined();
    expect(integrationTest.getState('caseDetail.messages').length).toBe(1);

    expect(
      formatted.draftDocuments.find(
        doc => doc.docketEntryId === draftOrder.docketEntryId,
      ),
    ).toBeFalsy();
  });
};
