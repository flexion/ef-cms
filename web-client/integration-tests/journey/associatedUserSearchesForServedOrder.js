import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';

export const associatedUserSearchesForServedOrder = (
  integrationTest,
  options,
  sealed = false,
) => {
  return it('associated user searches for served order', async () => {
    integrationTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);
    integrationTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: options.keyword,
        startDate: '1000-01-01',
      },
    });

    await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

    if (sealed) {
      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual([]);
    } else {
      expect(
        integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId:
              integrationTest.draftOrders[options.draftOrderIndex]
                .docketEntryId,
          }),
        ]),
      );
    }
  });
};
