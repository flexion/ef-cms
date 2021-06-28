import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

const { COUNTRY_TYPES } = applicationContext.getConstants();

export const unauthedUserSearchesByMeta = (integrationTest, overrides = {}) => {
  return it('Search for cases by meta data', async () => {
    const queryParams = {
      countryType: COUNTRY_TYPES.DOMESTIC,
      currentPage: 1,
      petitionerName: 'Aliens, Dude',
      ...overrides,
    };

    integrationTest.setState(
      'advancedSearchForm.caseSearchByName',
      queryParams,
    );

    await integrationTest.runSequence(
      'submitPublicCaseAdvancedSearchSequence',
      {},
    );

    const searchResults = integrationTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.CASE}`,
    );
    expect(searchResults.length).toBeGreaterThan(0);

    await integrationTest.runSequence('clearAdvancedSearchFormSequence', {
      formType: 'caseSearchByName',
    });
    expect(
      integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.CASE}`),
    ).toBeUndefined();
    expect(integrationTest.getState('advancedSearchForm')).toEqual({
      caseSearchByName: { countryType: COUNTRY_TYPES.DOMESTIC },
      currentPage: 1,
    });
  });
};
