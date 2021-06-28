import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';

export const unassociatedUserSearchesForServedOrderInSealedCase = (
  integrationTest,
  options,
) => {
  return it('unassociated user searches for served order in a sealed case', async () => {
    integrationTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    integrationTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: options.keyword,
      },
    });

    await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

    expect(
      integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId:
            integrationTest.draftOrders[options.draftOrderIndex].docketEntryId,
        }),
      ]),
    );
  });
};
