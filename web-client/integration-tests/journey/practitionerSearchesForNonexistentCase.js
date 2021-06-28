export const practitionerSearchesForNonexistentCase = integrationTest => {
  return it('Practitioner searches for nonexistent case', async () => {
    await integrationTest.runSequence('updateSearchTermSequence', {
      searchTerm: '999-99',
    });
    await integrationTest.runSequence('submitCaseSearchSequence');
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseSearchNoMatches',
    );
  });
};
