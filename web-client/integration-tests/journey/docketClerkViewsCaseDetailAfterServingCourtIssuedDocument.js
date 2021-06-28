import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkViewsCaseDetailAfterServingCourtIssuedDocument = (
  integrationTest,
  draftOrderIndex,
  expectedCaseStatus,
) => {
  return it('Docketclerk views case detail after serving court-issued document', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const { docketEntryId } = integrationTest.draftOrders[draftOrderIndex];

    const documents = integrationTest.getState('caseDetail.docketEntries');
    const orderDocument = documents.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(orderDocument.servedAt).toBeDefined();

    if (expectedCaseStatus) {
      expect(integrationTest.getState('caseDetail.status')).toEqual(
        expectedCaseStatus,
      );
    } else if (orderDocument.eventCode === 'O') {
      expect(integrationTest.getState('caseDetail.status')).toEqual(
        CASE_STATUS_TYPES.new,
      );
    } else {
      expect(integrationTest.getState('caseDetail.status')).toEqual(
        CASE_STATUS_TYPES.closed,
      );
      expect(integrationTest.getState('caseDetail.highPriority')).toEqual(
        false,
      );
    }
  });
};
