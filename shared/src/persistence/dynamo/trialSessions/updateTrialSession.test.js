const { updateTrialSession } = require('./updateTrialSession');

describe('updateTrialSession', () => {
  let putStub;
  beforeEach(() => {
    putStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });
  });

  it('invokes the persistence layer with pk of trial-session|{trialSessionId}, sk of trial-session|{trialSessionId} and other expected params', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: putStub,
      }),
    };
    await updateTrialSession({
      applicationContext,
      trialSessionToUpdate: {
        trialLocation: 'VEGAS BABY',
        trialSessionId: '123',
      },
    });
    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        pk: 'trial-session|123',
        sk: 'trial-session|123',
        trialLocation: 'VEGAS BABY',
        trialSessionId: '123',
      },
      applicationContext: { environment: { stage: 'dev' } },
    });
  });
});
