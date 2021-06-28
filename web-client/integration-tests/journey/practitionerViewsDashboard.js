import { refreshElasticsearchIndex } from '../helpers';

export const practitionerViewsDashboard = integrationTest => {
  return it('Practitioner views dashboard', async () => {
    await refreshElasticsearchIndex();
    await integrationTest.runSequence('gotoDashboardSequence');
    expect(integrationTest.getState('currentPage')).toEqual(
      'DashboardPractitioner',
    );
    expect(integrationTest.getState('openCases').length).toBeGreaterThan(0);
    const latestDocketNumber = integrationTest.getState(
      'openCases.0.docketNumber',
    );
    expect(integrationTest.docketNumber).toEqual(latestDocketNumber);
  });
};
