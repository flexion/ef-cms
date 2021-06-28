import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserViewsTodaysOrdersOnSealedCase = integrationTest => {
  return it('should view todays orders on sealed case', async () => {
    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoTodaysOrdersSequence', {});

    expect(integrationTest.getState('todaysOrders.results')).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentTitle: integrationTest.documentTitle,
          documentType: 'Order',
          numberOfPages: 1,
        }),
      ]),
    );
  });
};
