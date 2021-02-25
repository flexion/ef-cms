const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  DOCKET_SECTION,
} = require('../../../business/entities/EntityConstants');
const { getDocumentQCServedForUser } = require('./getDocumentQCServedForUser');
const {
  prepareDateFromString,
} = require('../../../business/utilities/DateHandler');

describe('getDocumentQCServedForUser', () => {
  let queryStub;

  beforeEach(() => {
    const itemsToReturn = [
      {
        pk: 'user-completed-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
        completedAt: 'today',
        section: DOCKET_SECTION,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
      {
        pk: 'user-completed-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
        completedAt: 'today',
        section: DOCKET_SECTION,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
      {
        pk: 'user-completed-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
        completedAt: 'today',
        section: DOCKET_SECTION,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ];

    queryStub = jest
      .fn()
      .mockReturnValue({
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
      ':pk': 'user-complete-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
      ':afterDate': prepareDateFromString()
              .startOf('day')
              .subtract(7, 'd')
              .utc()
              .format(),
    });

    expect(items).toEqual([
      {
        pk: 'user-completed-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
        completedAt: 'today',
        section: "docket",
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
      {
        pk: 'user-completed-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
        completedAt: 'today',
        section: "docket",
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
      {
        pk: 'user-completed-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
        completedAt: 'today',
        section: "docket",
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
