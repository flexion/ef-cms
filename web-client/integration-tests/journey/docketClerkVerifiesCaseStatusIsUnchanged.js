import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkVerifiesCaseStatusIsUnchanged = integrationTest => {
  return it('Docket clerk verifies case status is unchanged', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    const caseDetail = integrationTest.getState('caseDetail');

    expect(caseDetail.status).toBe(CASE_STATUS_TYPES.closed);
    expect(caseDetail.associatedJudge).toBe('Cohen');
  });
};
