import { refreshElasticsearchIndex } from '../helpers';

export const privatePractitionerViewsOpenConsolidatedCases =
  integrationTest => {
    return it('private practitioner views open consolidated cases', async () => {
      await refreshElasticsearchIndex();
      await integrationTest.runSequence('gotoDashboardSequence');

      expect(integrationTest.getState('currentPage')).toEqual(
        'DashboardPractitioner',
      );
      const openCases = integrationTest.getState('openCases');
      expect(openCases.length).toBeGreaterThan(0);

      const leadCase = openCases.find(
        c => c.docketNumber === integrationTest.leadDocketNumber,
      );
      expect(leadCase).toBeDefined();
      expect(leadCase).toHaveProperty('consolidatedCases');
      expect(leadCase.consolidatedCases.length).toEqual(1);
    });
  };
