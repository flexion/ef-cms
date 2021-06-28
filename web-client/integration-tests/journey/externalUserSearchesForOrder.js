import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';

export const externalUserSearchesForOrder = integrationTest => {
  return it('external user searches for an order', async () => {
    integrationTest.setState('advancedSearchForm', {
      orderSearch: {
        keyword: 'onomatopoeia',
      },
    });

    await integrationTest.runSequence('submitOrderAdvancedSearchSequence');

    expect(
      integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.ORDER}`),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: integrationTest.draftOrders[0].docketEntryId,
        }),
      ]),
    );
  });
};
