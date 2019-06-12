const { TrialSession, STATUS_TYPES } = require('./TrialSession');

const VALID_TRIAL_SESSION = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2025-03-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, AL',
};

describe('TrialSession entity', () => {
  describe('isValid', () => {
    it('creates a valid trial session', () => {
      const trialSession = new TrialSession(VALID_TRIAL_SESSION);
      expect(trialSession.isValid()).toBeTruthy();
    });

    it('creates an invalid trial session with startDate in the past', () => {
      const trialSession = new TrialSession({
        ...VALID_TRIAL_SESSION,
        startDate: '2000-03-01T00:00:00.000Z',
      });
      expect(trialSession.isValid()).toBeFalsy();
    });

    it('creates an invalid trial session with invalid sessionType', () => {
      const trialSession = new TrialSession({
        ...VALID_TRIAL_SESSION,
        sessionType: 'Something Else',
      });
      expect(trialSession.isValid()).toBeFalsy();
    });
  });

  describe('validate', () => {
    it('should do nothing if valid', () => {
      let error;
      try {
        const trialSession = new TrialSession(VALID_TRIAL_SESSION);
        trialSession.validate();
      } catch (err) {
        error = err;
      }
      expect(error).not.toBeDefined();
    });

    it('should throw an error on invalid documents', () => {
      let error;
      try {
        const trialSession = new TrialSession({});
        trialSession.validate();
      } catch (err) {
        error = err;
      }
      expect(error).toBeDefined();
    });
  });

  describe('generateSortKeyPrefix', () => {
    it('should generate correct sort key prefix for a regular trial session', () => {
      const trialSession = new TrialSession({
        ...VALID_TRIAL_SESSION,
        sessionType: 'Regular',
      });
      expect(trialSession.generateSortKeyPrefix()).toEqual('BirminghamAL-R');
    });

    it('should generate correct sort key prefix for a small trial session', () => {
      const trialSession = new TrialSession({
        ...VALID_TRIAL_SESSION,
        sessionType: 'Small',
      });
      expect(trialSession.generateSortKeyPrefix()).toEqual('BirminghamAL-S');
    });

    it('should generate correct sort key prefix for a hybrid trial session', () => {
      const trialSession = new TrialSession({
        ...VALID_TRIAL_SESSION,
        sessionType: 'Hybrid',
      });
      expect(trialSession.generateSortKeyPrefix()).toEqual('BirminghamAL-H');
    });
  });

  describe('setAsCalendared', () => {
    it('should set trial session as calendared', () => {
      const trialSession = new TrialSession({
        ...VALID_TRIAL_SESSION,
        sessionType: 'Hybrid',
      });
      trialSession.setAsCalendared();
      expect(trialSession.status).toEqual(STATUS_TYPES.calendared);
    });
  });

  describe('addCaseToCalendar', () => {
    it('should add case to calendar', () => {
      const trialSession = new TrialSession({
        ...VALID_TRIAL_SESSION,
        sessionType: 'Hybrid',
      });
      trialSession.addCaseToCalendar({ caseId: '123' });
      expect(trialSession.caseOrder[0]).toEqual('123');
    });
  });
});
