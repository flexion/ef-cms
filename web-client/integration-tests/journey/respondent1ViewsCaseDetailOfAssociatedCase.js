export const respondent1ViewsCaseDetailOfAssociatedCase = integrationTest => {
  return it('Respondent1 views case detail of associated case', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');
    expect(
      integrationTest.getState('caseDetail.irsPractitioners.1.name'),
    ).toEqual('Test IRS Practitioner1');
  });
};
