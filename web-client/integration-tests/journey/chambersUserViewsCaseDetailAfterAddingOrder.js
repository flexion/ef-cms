import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const chambersUserViewsCaseDetailAfterAddingOrder = (
  test,
  expectedDocumentCount = 2,
) => {
  return it('Chambers user views case detail after adding order', async () => {
    test.setState('caseDetail', {});

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('caseDetail.docketNumber')).toEqual(test.docketNumber);
    expect(test.getState('caseDetail.status')).toEqual(CASE_STATUS_TYPES.new);
    expect(test.getState('caseDetail.documents').length).toEqual(
      expectedDocumentCount,
    );
    expect(
      test
        .getState('caseDetail.documents')
        .find(d => d.documentTitle === 'Order of Dismissal and Decision'),
    ).toBeDefined();
  });
};
