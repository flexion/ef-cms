import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserViewsTodaysOrders = (integrationTest, testClient) => {
  return it('should view todays orders', async () => {
    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoTodaysOrdersSequence', {});

    //verifying that todays orders are sorted by most recent servedAt date
    expect(integrationTest.getState('todaysOrders.results')[0]).toMatchObject({
      documentTitle: integrationTest.documentTitle2,
      documentType: 'Order',
      numberOfPages: 1,
    });
    expect(integrationTest.getState('todaysOrders.results')[1]).toMatchObject({
      documentTitle: integrationTest.documentTitle1,
      documentType: 'Order',
      numberOfPages: 1,
    });

    await integrationTest.runSequence('openCaseDocumentDownloadUrlSequence', {
      docketEntryId: testClient.docketEntryId,
      docketNumber: testClient.docketNumber,
      isPublic: true,
      useSameTab: true,
    });

    expect(window.location.href).toContain(testClient.docketEntryId);
    window.location.href = undefined;
  });
};
