import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const chambersUserViewsCaseDetailAfterAddingOrder = (
  integrationTest,
  expectedDocumentCount = 2,
) => {
  return it('Chambers user views case detail after adding order', async () => {
    integrationTest.setState('caseDetail', {});

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    expect(integrationTest.getState('caseDetail.docketNumber')).toEqual(
      integrationTest.docketNumber,
    );
    expect(integrationTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.new,
    );
    expect(integrationTest.getState('caseDetail.docketEntries').length).toEqual(
      expectedDocumentCount,
    );
    expect(
      integrationTest
        .getState('caseDetail.docketEntries')
        .find(d => d.documentTitle === 'Order of Dismissal and Decision'),
    ).toBeDefined();
  });
};
