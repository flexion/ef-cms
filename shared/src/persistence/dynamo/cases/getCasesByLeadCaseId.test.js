const { getCasesByLeadCaseId } = require('./getCasesByLeadCaseId');

describe('getCasesByLeadCaseId', () => {
  let applicationContext;
  let getCaseByCaseIdStub;
  let isAuthorizedForWorkItemsStub;
  let queryStub;

  it('attempts to retrieve the cases by leadCaseId', async () => {
    queryStub = jest.fn(() => ({
      promise: async () => ({
        Items: [
          {
            caseId: 'abc',
          },
        ],
      }),
    }));

    getCaseByCaseIdStub = jest.fn().mockResolvedValue({
      caseId: '123',
      docketRecord: [],
      documents: [],
      irsPractitioners: [],
      pk: 'case|123',
      privatePractitioners: [],
      sk: 'case|123',
      status: 'New',
    });
    isAuthorizedForWorkItemsStub = jest.fn().mockReturnValue(true);

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        query: queryStub,
      }),
      getPersistenceGateway: () => ({
        getCaseByCaseId: getCaseByCaseIdStub,
      }),
      isAuthorizedForWorkItems: isAuthorizedForWorkItemsStub,
    };

    const result = await getCasesByLeadCaseId({
      applicationContext,
      leadCaseId: 'case|123',
    });
    expect(queryStub).toHaveBeenCalled();
    expect(getCaseByCaseIdStub).toHaveBeenCalled();
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

  it('returns an empty array when no items are returned', async () => {
    queryStub = jest.fn(() => ({
      promise: async () => ({
        Items: [],
      }),
    }));

    getCaseByCaseIdStub = jest.fn().mockResolvedValue([]);
    isAuthorizedForWorkItemsStub = jest.fn().mockReturnValue(true);

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        query: queryStub,
      }),
      getPersistenceGateway: () => ({
        getCaseByCaseId: getCaseByCaseIdStub,
      }),
      isAuthorizedForWorkItems: isAuthorizedForWorkItemsStub,
    };

    const result = await getCasesByLeadCaseId({
      applicationContext,
      leadCaseId: 'abc',
    });
    expect(queryStub).toHaveBeenCalled();
    expect(getCaseByCaseIdStub).not.toHaveBeenCalled();
    expect(isAuthorizedForWorkItemsStub).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
