export const practitionerSearchesForCase = integrationTest => {
  return it('Practitioner searches for case', async () => {
    await integrationTest.runSequence('updateSearchTermSequence', {
      searchTerm: integrationTest.docketNumber,
    });
    await integrationTest.runSequence('submitCaseSearchSequence');
    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');
  });
};
