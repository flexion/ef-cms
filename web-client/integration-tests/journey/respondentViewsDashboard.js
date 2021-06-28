export const respondentViewsDashboard = integrationTest => {
  return it('Respondent views dashboard', async () => {
    await integrationTest.runSequence('gotoDashboardSequence');
    expect(integrationTest.getState('currentPage')).toEqual(
      'DashboardRespondent',
    );
    expect(integrationTest.getState('openCases').length).toBeGreaterThanOrEqual(
      0,
    );
  });
};
