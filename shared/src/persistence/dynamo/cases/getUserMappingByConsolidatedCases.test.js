const {
  getUserMappingByConsolidatedCases,
} = require('./getUserMappingByConsolidatedCases');

const consolidatedCases = [{ caseId: '123' }, { caseId: '456' }];

describe('getUserMappingByConsolidatedCases', () => {
  let applicationContext;
  let getStub;

  it('attempts to retrieve the cases by leadCaseId', async () => {
    getStub = jest.fn(() => ({
      promise: async () => ({
        Item: { pk: '123' },
      }),
    }));

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getCurrentUser: () => ({ userId: '123' }),
      getDocumentClient: () => ({
        get: getStub,
      }),
    };

    const result = await getUserMappingByConsolidatedCases({
      applicationContext,
      consolidatedCases,
    });
    expect(getStub).toHaveBeenCalled();
    expect(result).toEqual([{ pk: '123' }, { pk: '123' }]);
  });

  it('returns an empty array when no items are returned', async () => {
    getStub = jest.fn(() => ({
      promise: async () => {
        throw new Error('something');
      },
    }));

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getCurrentUser: () => ({ userId: '123' }),
      getDocumentClient: () => ({
        get: getStub,
      }),
    };

    const result = await getUserMappingByConsolidatedCases({
      applicationContext,
      consolidatedCases,
    });
    expect(getStub).toHaveBeenCalled();
    expect(result).toEqual([undefined, undefined]);
  });
});
