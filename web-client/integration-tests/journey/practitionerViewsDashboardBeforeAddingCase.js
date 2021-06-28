export const practitionerViewsDashboardBeforeAddingCase = integrationTest => {
  return it('Practitioner views dashboard before adding the case', async () => {
    await integrationTest.runSequence('gotoDashboardSequence');
    expect(integrationTest.getState('currentPage')).toEqual(
      'DashboardPractitioner',
    );
  });
};
