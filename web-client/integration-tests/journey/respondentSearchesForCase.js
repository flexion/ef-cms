export const respondentSearchesForCase = integrationTest => {
  return it('Respondent searches for case', async () => {
    await integrationTest.runSequence('updateSearchTermSequence', {
      searchTerm: integrationTest.docketNumber,
    });
    await integrationTest.runSequence('submitCaseSearchSequence');
    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');
  });
};
