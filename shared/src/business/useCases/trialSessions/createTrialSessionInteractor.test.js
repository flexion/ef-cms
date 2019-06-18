const { createTrialSession } = require('./createTrialSessionInteractor');
const { User } = require('../../entities/User');

const MOCK_TRIAL = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2025-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, AL',
};

describe('createTrialSessionInteractor', () => {
  let applicationContext;

  it('throws error if user is unauthorized', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitioner',
          userId: 'petitioner',
        };
      },
      getPersistenceGateway: () => ({
        createTrialSession: () => {},
      }),
    };
    await expect(
      createTrialSession({
        applicationContext,
        trialSession: MOCK_TRIAL,
      }),
    ).rejects.toThrow();
  });

  it('throws an exception when it fails to create a trial session', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: 'docketclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        createTrialSession: () => {
          throw new Error('yup');
        },
      }),
    };

    let error;

    try {
      await createTrialSession({
        applicationContext,
        trialSession: MOCK_TRIAL,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });

  it('creates a trial session successfully', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: 'docketclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        createTrialSession: () => MOCK_TRIAL,
      }),
    };

    let error;

    try {
      await createTrialSession({
        applicationContext,
        trialSession: MOCK_TRIAL,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
  });

  it('sets the trial session as calendared if it is a Motion/Hearing session type', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: 'docketclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        createTrialSession: trial => trial,
      }),
    };

    const result = await createTrialSession({
      applicationContext,
      trialSession: {
        ...MOCK_TRIAL,
        sessionType: 'Motion/Hearing',
      },
    });

    expect(result.trialSession.isCalendared).toEqual(true);
  });

  it('sets the trial session as calendared if it is a Special session type', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: 'docketclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        createTrialSession: trial => trial,
      }),
    };

    const result = await createTrialSession({
      applicationContext,
      trialSession: {
        ...MOCK_TRIAL,
        sessionType: 'Special',
      },
    });

    expect(result.trialSession.isCalendared).toEqual(true);
  });

  it('does not set the trial session as calendared if it is a Regular session type', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: 'docketclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        createTrialSession: trial => trial,
      }),
    };

    const result = await createTrialSession({
      applicationContext,
      trialSession: MOCK_TRIAL,
    });

    expect(result.trialSession.isCalendared).toEqual(false);
  });
});
