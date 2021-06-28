export const privatePractitionerViewsOpenAndClosedCases = integrationTest => {
  return it('private practitioner views open and closed cases', async () => {
    await integrationTest.runSequence('gotoDashboardSequence');

    expect(integrationTest.getState('currentPage')).toEqual(
      'DashboardPractitioner',
    );
    expect(integrationTest.getState('openCases').length).toBeGreaterThan(0);
    expect(integrationTest.getState('closedCases').length).toBeGreaterThan(0);
  });
};
