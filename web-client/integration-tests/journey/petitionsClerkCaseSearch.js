export const petitionsClerkCaseSearch = integrationTest => {
  return it('Petitions clerk searches for case', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('updateSearchTermSequence', {
      searchTerm: integrationTest.docketNumber,
    });
    await integrationTest.runSequence('submitCaseSearchSequence');
    expect(integrationTest.getState('caseDetail.docketNumber')).toEqual(
      integrationTest.docketNumber,
    );
  });
};
