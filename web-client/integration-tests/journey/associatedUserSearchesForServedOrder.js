import {
  ADVANCED_SEARCH_TABS,
  DATE_RANGE_SEARCH_OPTIONS,
} from '../../../shared/src/business/entities/EntityConstants';

export const associatedUserSearchesForServedOrder = (
  cerebralTest,
  options,
  sealed = false,
) => {
  return it('associated user searches for served order', async () => {
    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);
    cerebralTest.setState('advancedSearchForm', {
      orderSearch: {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword: options.keyword,
        startDate: '1000-01-01',
      },
    });

    await cerebralTest.runSequence('submitOrderAdvancedSearchSequence');

    if (sealed) {
      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual([]);
    } else {
      expect(
        cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketEntryId:
              cerebralTest.draftOrders[options.draftOrderIndex].docketEntryId,
          }),
        ]),
      );
    }
  });
};
