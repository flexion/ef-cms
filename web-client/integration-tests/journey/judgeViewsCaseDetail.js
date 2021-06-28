import { contactPrimaryFromState } from '../helpers';

export const judgeViewsCaseDetail = integrationTest => {
  return it('Judge views case detail', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const caseDetail = integrationTest.getState('caseDetail');

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    expect(integrationTest.getState('caseDetail.docketNumber')).toEqual(
      integrationTest.docketNumber,
    );

    expect(caseDetail.associatedJudge).toBeDefined();
    expect(caseDetail.status).toBeDefined();
    expect(contactPrimaryFromState(integrationTest).contactId).toBeDefined();
  });
};
