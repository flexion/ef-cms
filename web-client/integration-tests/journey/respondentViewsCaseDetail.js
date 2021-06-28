export const respondentViewsCaseDetail = (
  integrationTest,
  isAssociated = true,
) => {
  return it('Respondent views case detail', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');

    if (isAssociated) {
      expect(integrationTest.getState('caseDetail.irsPractitioners')).toEqual(
        [],
      );
    }
  });
};
