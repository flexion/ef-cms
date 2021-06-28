import { refreshElasticsearchIndex } from '../helpers';

export const petitionerViewsDashboard = integrationTest => {
  return it('petitioner views dashboard', async () => {
    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoDashboardSequence');

    expect(integrationTest.getState('currentPage')).toEqual(
      'DashboardPetitioner',
    );
    expect(integrationTest.getState('openCases').length).toBeGreaterThan(0);
    integrationTest.docketNumber = integrationTest.getState(
      'openCases.0.docketNumber',
    );
  });
};
