const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  DOCKET_SECTION,
} = require('../../../business/entities/EntityConstants');
const {
  prepareDateFromString,
} = require('../../../business/utilities/DateHandler');
const { getDocumentQCServedForUser } = require('./getDocumentQCServedForUser');

describe('getDocumentQCServedForUser', () => {
  let queryStub;

  beforeEach(() => {
    const itemsToReturn = [
      {
        completedAt: 'today',
        completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        pk: 'user-complete-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
        section: DOCKET_SECTION,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
      {
        completedAt: 'today',
        completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        pk: 'user-complete-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
        section: DOCKET_SECTION,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
      {
        completedAt: 'today',
        completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        pk: 'user-complete-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
        section: DOCKET_SECTION,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
      {
        completedAt: 'today',
        completedByUserId: 'f9ba126f-cb16-4035-985a-c3af4e72bdc1',
        pk: 'user-complete-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
        section: DOCKET_SECTION,
      },
    ];

    queryStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: itemsToReturn,
      }),
    });
  });

  it('should filter out the work items returned from persistence to only have served documents', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      section: DOCKET_SECTION,
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getDocumentClient.mockReturnValue({
      query: queryStub,
    });
    const items = await getDocumentQCServedForUser({
      applicationContext,
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(queryStub.mock.calls[0][0].ExpressionAttributeValues).toEqual({
      ':afterDate': prepareDateFromString()
        .startOf('day')
        .subtract(7, 'd')
        .utc()
        .format(),
      ':pk': 'user-complete-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
    });

    expect(items).toEqual([
      {
        completedAt: 'today',
        completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        pk: 'user-complete-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
        section: 'docket',
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
      {
        completedAt: 'today',
        completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        pk: 'user-complete-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
        section: 'docket',
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
      {
        completedAt: 'today',
        completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        pk: 'user-complete-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
        section: 'docket',
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
