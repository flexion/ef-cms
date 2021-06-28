import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';

export const admissionsClerkSearchesForPractitionerByBarNumber =
  integrationTest => {
    return it('admissions clerk searches for practitioner by bar number', async () => {
      await integrationTest.runSequence('gotoAdvancedSearchSequence');

      integrationTest.setState(
        'advancedSearchTab',
        ADVANCED_SEARCH_TABS.PRACTITIONER,
      );

      await integrationTest.runSequence('advancedSearchTabChangeSequence');

      expect(
        integrationTest.getState(
          'advancedSearchForm.practitionerSearchByBarNumber',
        ),
      ).toEqual({});
      expect(
        integrationTest.getState(
          `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}`,
        ),
      ).toEqual([]);

      await integrationTest.runSequence(
        'submitPractitionerBarNumberSearchSequence',
      );
      expect(
        integrationTest.getState('validationErrors.barNumber'),
      ).toBeDefined();

      // no matches
      await integrationTest.runSequence(
        'updateAdvancedSearchFormValueSequence',
        {
          formType: 'practitionerSearchByBarNumber',
          key: 'barNumber',
          value: 'abc123',
        },
      );

      await integrationTest.runSequence(
        'submitPractitionerBarNumberSearchSequence',
      );
      expect(
        integrationTest.getState('validationErrors.barNumber'),
      ).toBeUndefined();

      expect(
        integrationTest.getState(
          `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}`,
        ).length,
      ).toEqual(0);
      expect(integrationTest.getState('currentPage')).toEqual('AdvancedSearch');

      // single match
      await integrationTest.runSequence(
        'updateAdvancedSearchFormValueSequence',
        {
          formType: 'practitionerSearchByBarNumber',
          key: 'barNumber',
          value: 'PT1234',
        },
      );

      await integrationTest.runSequence(
        'submitPractitionerBarNumberSearchSequence',
      );

      expect(integrationTest.getState('currentPage')).toEqual(
        'PractitionerDetail',
      );

      expect(integrationTest.getState('practitionerDetail.barNumber')).toEqual(
        'PT1234',
      );
    });
  };
