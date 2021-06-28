import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../helpers';

export const externalUserSearchesForAnOrderOnSealedCase = integrationTest => {
  return it('external user searches for an order on sealed case', async () => {
    integrationTest.setState('searchResults', []);
    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoAdvancedSearchSequence');

    integrationTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'Order for a sealed case',
      },
    });

    await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

    expect(
      integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentTitle: 'Order for a sealed case',
        }),
      ]),
    );
  });
};
