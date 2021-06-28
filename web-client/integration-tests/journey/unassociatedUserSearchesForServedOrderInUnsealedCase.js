import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';

export const unassociatedUserSearchesForServedOrderInUnsealedCase = (
  integrationTest,
  options,
) => {
  return it('unassociated user searches for served order in an unsealed case', async () => {
    integrationTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.ORDER);

    integrationTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: options.keyword,
        startDate: '1000-01-01',
      },
    });

    await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

    expect(
      integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId:
            integrationTest.draftOrders[options.draftOrderIndex].docketEntryId,
        }),
      ]),
    );
  });
};
