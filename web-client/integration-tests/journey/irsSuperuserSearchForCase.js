export const irsSuperuserSearchForCase = integrationTest => {
  return it('irsSuperuser searches for case by docket number from dashboard', async () => {
    await integrationTest.runSequence('gotoDashboardSequence');
    integrationTest.setState('header.searchTerm', integrationTest.docketNumber);
    await integrationTest.runSequence('submitCaseSearchSequence');
    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');
  });
};
