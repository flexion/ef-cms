export const respondentSearchesForNonexistentCase = integrationTest => {
  return it('Respondent searches for a nonexistent case', async () => {
    await integrationTest.runSequence('updateSearchTermSequence', {
      searchTerm: '999-99',
    });
    await integrationTest.runSequence('submitCaseSearchSequence');
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseSearchNoMatches',
    );
  });
};
