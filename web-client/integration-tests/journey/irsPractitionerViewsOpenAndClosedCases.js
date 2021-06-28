export const irsPractitionerViewsOpenAndClosedCases = integrationTest => {
  return it('irs practitoner views open and closed cases', async () => {
    await integrationTest.runSequence('gotoDashboardSequence');

    expect(integrationTest.getState('currentPage')).toEqual(
      'DashboardRespondent',
    );
    expect(integrationTest.getState('openCases').length).toBeGreaterThan(0);
    expect(integrationTest.getState('closedCases').length).toBeGreaterThan(0);
  });
};
