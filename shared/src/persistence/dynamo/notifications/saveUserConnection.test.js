const { saveUserConnection } = require('./saveUserConnection');

describe('saveUserConnection', () => {
  let applicationContext;
  let putStub;

  beforeEach(() => {
    putStub = jest.fn(() => ({
      promise: async () => null,
    }));

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: putStub,
      }),
    };
  });

  it('attempts to persist the websocket connection details', async () => {
    await saveUserConnection({
      applicationContext,
      connectionId: 'abc',
      endpoint: {},
      userId: '123',
    });
    expect(putStub).toHaveBeenCalledWith({
      Item: {
        connectionId: 'abc',
        endpoint: {},
        gsi1pk: 'connection|abc',
        pk: 'user|123',
        sk: 'connection|abc',
        ttl: expect.anything(),
      },
      TableName: 'efcms-dev',
      applicationContext: expect.anything(),
    });
  });
});
