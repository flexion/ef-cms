import {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
} from '../../../shared/src/business/entities/EntityConstants';

export const chambersUserViewsCaseDetail = (
  integrationTest,
  expectedDocumentCount = 2,
) => {
  return it('Chambers user views case detail', async () => {
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
    expect(integrationTest.getState('caseDetail.associatedJudge')).toEqual(
      CHIEF_JUDGE,
    );
  });
};
