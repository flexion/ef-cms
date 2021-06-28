export const respondentViewsCaseDetailOfUnassociatedCase = integrationTest => {
  return it('Respondent views case detail of unassociated case', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');
  });
};
