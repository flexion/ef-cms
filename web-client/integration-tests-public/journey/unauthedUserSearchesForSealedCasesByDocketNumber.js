import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';

export const unauthedUserSearchesForSealedCasesByDocketNumber =
  integrationTest => {
    return it('Search for a sealed case by docket number', async () => {
      integrationTest.currentRouteUrl = '';
      integrationTest.setState('caseSearchByDocketNumber', {});

      await integrationTest.runSequence(
        'updateAdvancedSearchFormValueSequence',
        {
          formType: 'caseSearchByDocketNumber',
          key: 'docketNumber',
          value: integrationTest.docketNumber,
        },
      );

      await integrationTest.runSequence(
        'submitPublicCaseDocketNumberSearchSequence',
      );

      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.CASE}`),
      ).toEqual([]);
      expect(integrationTest.currentRouteUrl).toBe(
        `/case-detail/${integrationTest.docketNumber}`,
      );
    });
  };
