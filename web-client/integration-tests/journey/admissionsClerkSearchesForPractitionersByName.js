import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { advancedSearchHelper } from '../../src/presenter/computeds/AdvancedSearch/advancedSearchHelper';
import { formatNow } from '../../../shared/src/business/utilities/DateHandler';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const admissionsClerkSearchesForPractitionersByName =
  integrationTest => {
    const practitionerResultsContainDuplicates = searchResults => {
      const barNumberOccurrences = {};
      searchResults.forEach(practitioner => {
        barNumberOccurrences[practitioner.barNumber] =
          1 + (barNumberOccurrences[practitioner.barNumber] || 0);
      });
      const resultsContainDuplicateBarNumbers = Object.values(
        barNumberOccurrences,
      ).some(count => count > 1);
      return resultsContainDuplicateBarNumbers;
    };

    return it('admissions clerk searches for practitioners by name', async () => {
      await integrationTest.runSequence('gotoAdvancedSearchSequence');

      await refreshElasticsearchIndex();

      integrationTest.setState(
        'advancedSearchTab',
        ADVANCED_SEARCH_TABS.PRACTITIONER,
      );

      await integrationTest.runSequence('advancedSearchTabChangeSequence');

      expect(
        integrationTest.getState('advancedSearchForm.practitionerSearchByName'),
      ).toEqual({});
      expect(
        integrationTest.getState(
          `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}`,
        ),
      ).toBeUndefined();

      await integrationTest.runSequence('submitPractitionerNameSearchSequence');
      expect(
        integrationTest.getState('validationErrors.practitionerName'),
      ).toBeDefined();

      // non-exact matches
      await integrationTest.runSequence(
        'updateAdvancedSearchFormValueSequence',
        {
          formType: 'practitionerSearchByName',
          key: 'practitionerName',
          value: 'test',
        },
      );

      await integrationTest.runSequence('submitPractitionerNameSearchSequence');
      expect(
        integrationTest.getState('validationErrors.practitionerName'),
      ).toBeUndefined();

      const searchResults = integrationTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}`,
      );
      expect(practitionerResultsContainDuplicates(searchResults)).toBeFalsy();

      expect(
        integrationTest.getState(
          `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}`,
        ).length,
      ).toBeGreaterThan(0);
      let helper = runCompute(withAppContextDecorator(advancedSearchHelper), {
        state: integrationTest.getState(),
      });

      expect(helper.formattedSearchResults.length).toEqual(
        integrationTest.getState('constants.CASE_SEARCH_PAGE_SIZE'),
      );
      expect(helper.showLoadMore).toBeTruthy();

      await integrationTest.runSequence('clearAdvancedSearchFormSequence', {
        formType: 'practitionerSearchByName',
      });

      expect(
        integrationTest.getState('advancedSearchForm.practitionerSearchByName'),
      ).toEqual({});
      expect(
        integrationTest.getState(
          `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}`,
        ),
      ).toBeUndefined();

      // exact match
      await integrationTest.runSequence(
        'updateAdvancedSearchFormValueSequence',
        {
          formType: 'practitionerSearchByName',
          key: 'practitionerName',
          value: `Joe ${integrationTest.currentTimestamp} Exotic Tiger King`,
        },
      );

      await integrationTest.runSequence('submitPractitionerNameSearchSequence');

      expect(
        integrationTest.getState(
          `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}`,
        ).length,
      ).toBeGreaterThan(0);
      expect(
        integrationTest.getState(
          `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}.0.name`,
        ),
      ).toEqual(`joe ${integrationTest.currentTimestamp} exotic tiger king`);
      const currentTwoDigitYear = formatNow('YY');
      expect(
        integrationTest.getState(
          `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}.0.barNumber`,
        ),
      ).toContain(`EJ${currentTwoDigitYear}`);

      // no matches
      await integrationTest.runSequence(
        'updateAdvancedSearchFormValueSequence',
        {
          formType: 'practitionerSearchByName',
          key: 'practitionerName',
          value: 'not a real name',
        },
      );

      await integrationTest.runSequence('submitPractitionerNameSearchSequence');

      expect(
        integrationTest.getState(
          `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}`,
        ).length,
      ).toEqual(0);

      helper = runCompute(withAppContextDecorator(advancedSearchHelper), {
        state: integrationTest.getState(),
      });

      expect(helper.showLoadMore).toBeFalsy();
      expect(helper.formattedSearchResults.length).toEqual(0);
      expect(helper.showNoMatches).toBeTruthy();
    });
  };
