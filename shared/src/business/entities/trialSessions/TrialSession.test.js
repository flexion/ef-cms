const { TrialSession } = require('./TrialSession');

const VALID_TRIAL_SESSION = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2025-03-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, AL',
};

describe('TrialSession entity', () => {
  let applicationContext;

  beforeAll(() => {
    applicationContext = {
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
  });

  describe('isValid', () => {
    it('should throw an error if app context is not passed in', () => {
      expect(() => new TrialSession({}, {})).toThrow();
    });

    it('creates a valid trial session', () => {
      const trialSession = new TrialSession(VALID_TRIAL_SESSION, {
        applicationContext,
      });
      expect(trialSession.isValid()).toBeTruthy();
    });

    it('creates a valid trial session with startDate in the past', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          startDate: '2000-03-01T00:00:00.000Z',
        },
        {
          applicationContext,
        },
      );
      expect(trialSession.isValid()).toBeTruthy();
    });

    it('creates an invalid trial session with invalid sessionType', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Something Else',
        },
        {
          applicationContext,
        },
      );
      expect(trialSession.isValid()).toBeFalsy();
    });
  });

  describe('validate', () => {
    it('should do nothing if valid', () => {
      let error;
      try {
        const trialSession = new TrialSession(VALID_TRIAL_SESSION, {
          applicationContext,
        });
        trialSession.validate();
      } catch (err) {
        error = err;
      }
      expect(error).not.toBeDefined();
    });

    it('should throw an error on invalid documents', () => {
      let error;
      try {
        const trialSession = new TrialSession(
          {},
          {
            applicationContext,
          },
        );
        trialSession.validate();
      } catch (err) {
        error = err;
      }
      expect(error).toBeDefined();
    });
  });

  describe('generateSortKeyPrefix', () => {
    it('should generate correct sort key prefix for a regular trial session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Regular',
        },
        {
          applicationContext,
        },
      );
      expect(trialSession.generateSortKeyPrefix()).toEqual('BirminghamAL-R');
    });

    it('should generate correct sort key prefix for a small trial session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Small',
        },
        {
          applicationContext,
        },
      );
      expect(trialSession.generateSortKeyPrefix()).toEqual('BirminghamAL-S');
    });

    it('should generate correct sort key prefix for a hybrid trial session', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Hybrid',
        },
        {
          applicationContext,
        },
      );
      expect(trialSession.generateSortKeyPrefix()).toEqual('BirminghamAL-H');
    });
  });

  describe('setAsCalendared', () => {
    it('should set a valid trial session entity as calendared upon request', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Hybrid',
        },
        {
          applicationContext,
        },
      );
      trialSession.setAsCalendared();
      expect(trialSession.isCalendared).toEqual(true);
    });
  });

  describe('addCaseToCalendar', () => {
    it('should add case to calendar of valid trial session when provided a raw case entity with a caseId', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Hybrid',
        },
        {
          applicationContext,
        },
      );
      trialSession.addCaseToCalendar({ caseId: '123' });
      expect(trialSession.caseOrder[0]).toEqual({ caseId: '123' });
    });
  });

  describe('removeCaseFromCalendar', () => {
    it('should set case on calendar to removedFromTrial with removedFromTrialDate and disposition', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Hybrid',
        },
        {
          applicationContext,
        },
      );
      trialSession.addCaseToCalendar({ caseId: '123' });
      trialSession.addCaseToCalendar({ caseId: '234' });
      trialSession.addCaseToCalendar({ caseId: '456' });
      expect(trialSession.caseOrder.length).toEqual(3);

      trialSession.removeCaseFromCalendar({
        caseId: '123',
        disposition: 'because',
      });

      expect(trialSession.caseOrder.length).toEqual(3);
      expect(trialSession.caseOrder[0]).toMatchObject({
        caseId: '123',
        disposition: 'because',
        removedFromTrial: true,
      });
      expect(trialSession.caseOrder[0].removedFromTrialDate).toBeDefined();
      expect(trialSession.caseOrder[1]).not.toHaveProperty('removedFromTrial');
      expect(trialSession.caseOrder[2]).not.toHaveProperty('removedFromTrial');
    });

    it('should not modify case calendar if caseId is not in caseOrder', () => {
      const trialSession = new TrialSession(
        {
          ...VALID_TRIAL_SESSION,
          sessionType: 'Hybrid',
        },
        {
          applicationContext,
        },
      );
      trialSession.addCaseToCalendar({ caseId: '123' });
      trialSession.addCaseToCalendar({ caseId: '234' });
      trialSession.addCaseToCalendar({ caseId: '456' });
      expect(trialSession.caseOrder.length).toEqual(3);

      trialSession.removeCaseFromCalendar({
        caseId: 'abc',
        disposition: 'because',
      });

      expect(trialSession.caseOrder.length).toEqual(3);
      expect(trialSession.caseOrder[0]).not.toHaveProperty('removedFromTrial');
      expect(trialSession.caseOrder[1]).not.toHaveProperty('removedFromTrial');
      expect(trialSession.caseOrder[2]).not.toHaveProperty('removedFromTrial');
    });
  });
});
