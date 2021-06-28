import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkCreatesAnOrder = (integrationTest, data) => {
  return it('Docket Clerk creates an order', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence(
      'openCreateOrderChooseTypeModalSequence',
      {},
    );

    expect(integrationTest.getState('modal.documentTitle')).toBeFalsy();

    await integrationTest.runSequence(
      'updateCreateOrderModalFormValueSequence',
      {
        key: 'eventCode',
        value: data.eventCode,
      },
    );

    if (data.expectedDocumentType) {
      expect(integrationTest.getState('modal.documentType')).toEqual(
        data.expectedDocumentType,
      );
    } else {
      expect(
        integrationTest.getState('modal.documentType').length,
      ).toBeGreaterThan(0);
    }

    await integrationTest.runSequence(
      'updateCreateOrderModalFormValueSequence',
      {
        key: 'documentTitle',
        value: data.documentTitle,
      },
    );

    await integrationTest.runSequence('submitCreateOrderModalSequence');

    expect(integrationTest.getState('currentPage')).toBe('CreateOrder');

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: 'Some order content',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'documentContents',
      value: data.documentContents || 'Some order content',
    });

    await integrationTest.runSequence('submitCourtIssuedOrderSequence');

    //skip signing and go back to caseDetail
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

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

    expect(integrationTest.getState('draftDocumentViewerDocketEntryId')).toBe(
      newDraftOrder.docketEntryId,
    );

    expect(newDraftOrder).toBeTruthy();
    integrationTest.draftOrders.push(newDraftOrder);
    integrationTest.docketEntryId = newDraftOrder.docketEntryId;
  });
};
