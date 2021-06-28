import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../helpers';

export const irsSuperuserAdvancedSearchForCaseDocketNumber =
  integrationTest => {
    return it('irsSuperuser performs an advanced search for a case', async () => {
      await refreshElasticsearchIndex();

      await integrationTest.runSequence('gotoAdvancedSearchSequence');

      await integrationTest.runSequence(
        'updateAdvancedSearchFormValueSequence',
        {
          formType: 'caseSearchByDocketNumber',
          key: 'docketNumber',
          value: integrationTest.docketNumber,
        },
      );

      await integrationTest.runSequence('submitCaseAdvancedSearchSequence');

      expect(integrationTest.getState('validationErrors')).toEqual({});

      expect(
        integrationTest
          .getState(`searchResults.${ADVANCED_SEARCH_TABS.CASE}`)
          .find(result => result.docketNumber === integrationTest.docketNumber),
      ).toBeDefined();
    });
  };
