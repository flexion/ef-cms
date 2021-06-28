import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { DocumentSearch } from '../../../shared/src/business/entities/documents/DocumentSearch';

export const unauthedUserInvalidSearchForOrder = integrationTest => {
  return it('Search for order without a keyword', async () => {
    await integrationTest.runSequence('gotoPublicSearchSequence');

    integrationTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    await integrationTest.runSequence(
      'submitPublicOrderAdvancedSearchSequence',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({
      keyword: DocumentSearch.VALIDATION_ERROR_MESSAGES.keyword,
    });
  });
};
