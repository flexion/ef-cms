import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../helpers';

export const userSearchesForStrickenDocument = integrationTest => {
  return it('User searches for a stricken order', async () => {
    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoAdvancedSearchSequence');

    integrationTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'Order that is stricken',
      },
    });

    await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

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
