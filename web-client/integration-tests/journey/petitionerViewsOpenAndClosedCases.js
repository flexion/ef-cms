import { refreshElasticsearchIndex } from '../helpers';

export const petitionerViewsOpenAndClosedCases = integrationTest => {
  return it('petitioner views open and closed cases', async () => {
    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoDashboardSequence');

    expect(integrationTest.getState('currentPage')).toEqual(
      'DashboardPetitioner',
    );
    expect(integrationTest.getState('openCases').length).toBeGreaterThan(0);
    expect(integrationTest.getState('closedCases')[0]).toMatchObject({
      docketNumber: integrationTest.docketNumber,
    });
  });
};
