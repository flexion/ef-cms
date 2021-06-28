import {
  ADVANCED_SEARCH_TABS,
  COUNTRY_TYPES,
} from '../../../shared/src/business/entities/EntityConstants';
import { CaseSearch } from '../../../shared/src/business/entities/cases/CaseSearch';
import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerkAdvancedSearchForCase = integrationTest => {
  return it('petitions clerk performs an advanced search for a case', async () => {
    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoAdvancedSearchSequence');

    await integrationTest.runSequence('submitCaseAdvancedSearchSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      petitionerName: CaseSearch.VALIDATION_ERROR_MESSAGES.petitionerName,
    });

    await integrationTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'petitionerName',
      value: 'Stormborn',
    });
    await integrationTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'yearFiledMin',
      value: '1800',
    });
    await integrationTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'yearFiledMax',
      value: '2030',
    });

    await integrationTest.runSequence('submitCaseAdvancedSearchSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      yearFiledMax: 'Enter a valid ending year',
      yearFiledMin: 'Enter a valid start year',
    });

    await integrationTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'yearFiledMin',
      value: '2001',
    });
    await integrationTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'yearFiledMax',
      value: '2001',
    });
    await integrationTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'countryType',
      value: COUNTRY_TYPES.INTERNATIONAL,
    });

    await integrationTest.runSequence('submitCaseAdvancedSearchSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(
      integrationTest
        .getState(`searchResults.${ADVANCED_SEARCH_TABS.CASE}`)
        .find(result => result.docketNumber === integrationTest.docketNumber),
    ).toBeDefined();
  });
};
