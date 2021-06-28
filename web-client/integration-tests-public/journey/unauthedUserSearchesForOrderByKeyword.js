import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserSearchesForOrderByKeyword = (
  integrationTest,
  testClient,
) => {
  return it('Search for order by keyword', async () => {
    await refreshElasticsearchIndex();

    integrationTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'osteodontolignikeratic',
        startDate: '1000-01-01',
      },
    });

    await integrationTest.runSequence(
      'submitPublicOrderAdvancedSearchSequence',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({});
    expect(
      integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).toEqual([]);

    integrationTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'dismissed',
        startDate: '1000-01-01',
      },
    });

    await integrationTest.runSequence(
      'submitPublicOrderAdvancedSearchSequence',
    );

    expect(
      integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: testClient.draftOrders[1].docketEntryId,
        }),
      ]),
    );
    expect(
      integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: testClient.draftOrders[2].docketEntryId,
        }),
      ]),
    );
  });
};
