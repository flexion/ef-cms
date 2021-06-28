export const respondentViewsCaseDetailOfAssociatedCase = integrationTest => {
  return it('Respondent views case detail of associated case', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');
    expect(
      integrationTest.getState('caseDetail.irsPractitioners.0.name'),
    ).toEqual('Test IRS Practitioner');
  });
};
