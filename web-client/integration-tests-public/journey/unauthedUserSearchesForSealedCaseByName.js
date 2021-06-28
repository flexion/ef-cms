import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserSearchesForSealedCaseByName = integrationTest => {
  return it('Search for sealed case by name', async () => {
    await refreshElasticsearchIndex(3000);

    const queryParams = {
      petitionerName: 'NOTAREALNAMEFORTESTINGPUBLIC',
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
    expect(searchResults.length).toEqual(0);
  });
};
