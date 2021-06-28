import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserSearchesForStrickenOrder = integrationTest => {
  return it('Unauthed user searches for a stricken order', async () => {
    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoPublicSearchSequence');

    integrationTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'Order that is stricken',
      },
    });

    await integrationTest.runSequence(
      'submitPublicOrderAdvancedSearchSequence',
    );

    expect(
      integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentTitle: 'Order that is stricken',
        }),
      ]),
    );
  });
};
