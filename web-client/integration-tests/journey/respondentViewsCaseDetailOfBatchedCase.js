import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const respondentViewsCaseDetailOfBatchedCase = integrationTest => {
  return it('Respondent views case detail', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');
    expect(integrationTest.getState('caseDetail.docketNumber')).toEqual(
      integrationTest.docketNumber,
    );
    expect(integrationTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.generalDocket,
    );
    expect(integrationTest.getState('caseDetail.docketEntries').length).toEqual(
      2,
    );
  });
};
