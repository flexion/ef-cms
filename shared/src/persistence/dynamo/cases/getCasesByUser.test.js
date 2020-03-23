const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const { getCasesByUser } = require('./getCasesByUser');
const { User } = require('../../../business/entities/User');

let queryStub = jest.fn().mockReturnValue({
  promise: async () => ({
    Items: [],
  }),
});

const applicationContext = {
  environment: {
    stage: 'local',
  },
  filterCaseMetadata: ({ cases }) => cases,
  getDocumentClient: () => ({
    query: queryStub,
  }),
  isAuthorizedForWorkItems: () => true,
};

const user = {
  role: User.ROLES.petitioner,
  userId: 'petitioner',
};

describe('getCasesByUser', () => {
  beforeEach(() => {
    client.query = jest
      .fn()
      .mockReturnValueOnce([
        {
          caseId: '123',
          pk: 'case|123',
          sk: 'case|123',
          status: 'New',
        },
      ])
      .mockReturnValueOnce([
        {
          caseId: '123',
          pk: 'case|123',
          sk: 'case|123',
          status: 'New',
        },
      ]);
  });

  it('should return data as received from persistence', async () => {
    const result = await getCasesByUser({
      applicationContext,
      user,
    });
    expect(result).toEqual([
      {
        caseId: '123',
        docketRecord: [],
        documents: [],
        irsPractitioners: [],
        pk: 'case|123',
        privatePractitioners: [],
        sk: 'case|123',
        status: 'New',
      },
    ]);
  });

  it('should attempt to do a query using the found caseIds', async () => {
    await getCasesByUser({
      applicationContext,
      user,
    });
    expect(client.query.mock.calls[1][0].ExpressionAttributeValues).toEqual({
      ':pk': 'case|123',
    });
  });
});
