import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';

const integrationTest = setupTest();
const { CASE_TYPES_MAP } = applicationContext.getConstants();

describe('Trial Session Eligible Cases - Both small and regular cases get scheduled to the trial session that’s a hybrid session', () => {
  beforeAll(() => {
    jest.setTimeout(50000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  const trialLocation = `Despacito, Texas, ${Date.now()}`;
  const overrides = {
    maxCases: 2,
    preferredTrialCity: trialLocation,
    sessionType: 'Hybrid',
    trialLocation,
  };
  const createdDocketNumbers = [];

  describe(`Create trial session with Hybrid session type for '${trialLocation}' with max case count = 2`, () => {
    loginAs(integrationTest, 'docketclerk@example.com');
    docketClerkCreatesATrialSession(integrationTest, overrides);
    docketClerkViewsTrialSessionList(integrationTest);
    docketClerkViewsNewTrialSession(integrationTest);
  });

  describe('Create cases', () => {
    describe(`Case with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small case type with filed date 1/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.deficiency,
        procedureType: 'Small',
        receivedAtDay: '01',
        receivedAtMonth: '01',
        receivedAtYear: '2019',
      };
      loginAs(integrationTest, 'petitioner@example.com');
      it('Create case #1', async () => {
        const caseDetail = await uploadPetition(integrationTest, caseOverrides);
        expect(caseDetail.docketNumber).toBeDefined();
        createdDocketNumbers.push(caseDetail.docketNumber);
        integrationTest.docketNumber = caseDetail.docketNumber;
      });

      loginAs(integrationTest, 'petitionsclerk@example.com');
      petitionsClerkSubmitsCaseToIrs(integrationTest);

      loginAs(integrationTest, 'docketclerk@example.com');
      docketClerkSetsCaseReadyForTrial(integrationTest);
    });

    describe(`Case with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Regular case type with filed date 1/2/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.deficiency,
        procedureType: 'Regular',
        receivedAtDay: '02',
        receivedAtMonth: '01',
        receivedAtYear: '2019',
      };
      loginAs(integrationTest, 'petitioner@example.com');
      it('Create case #2', async () => {
        const caseDetail = await uploadPetition(integrationTest, caseOverrides);
        expect(caseDetail.docketNumber).toBeDefined();
        createdDocketNumbers.push(caseDetail.docketNumber);
        integrationTest.docketNumber = caseDetail.docketNumber;
      });

      loginAs(integrationTest, 'petitionsclerk@example.com');
      petitionsClerkSubmitsCaseToIrs(integrationTest);

      loginAs(integrationTest, 'docketclerk@example.com');
      docketClerkSetsCaseReadyForTrial(integrationTest);
    });

    describe(`Case with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small case type with filed date 2/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.deficiency,
        procedureType: 'Small',
        receivedAtDay: '01',
        receivedAtMonth: '02',
        receivedAtYear: '2019',
      };
      loginAs(integrationTest, 'petitioner@example.com');
      it('Create case #3', async () => {
        const caseDetail = await uploadPetition(integrationTest, caseOverrides);
        expect(caseDetail.docketNumber).toBeDefined();
        createdDocketNumbers.push(caseDetail.docketNumber);
        integrationTest.docketNumber = caseDetail.docketNumber;
      });

      loginAs(integrationTest, 'petitionsclerk@example.com');
      petitionsClerkSubmitsCaseToIrs(integrationTest);

      loginAs(integrationTest, 'docketclerk@example.com');
      docketClerkSetsCaseReadyForTrial(integrationTest);
    });
  });

  describe(`Result: Case #1, #2, and #3 should show as eligible for '${trialLocation}' session`, () => {
    loginAs(integrationTest, 'petitionsclerk@example.com');

    it(`Case #1, #2, and #3 should show as eligible for '${trialLocation}' session`, async () => {
      await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: integrationTest.trialSessionId,
      });

      expect(
        integrationTest.getState('trialSession.eligibleCases').length,
      ).toEqual(3);
      expect(
        integrationTest.getState('trialSession.eligibleCases.0.docketNumber'),
      ).toEqual(createdDocketNumbers[0]);
      expect(
        integrationTest.getState('trialSession.eligibleCases.1.docketNumber'),
      ).toEqual(createdDocketNumbers[1]);
      expect(
        integrationTest.getState('trialSession.eligibleCases.2.docketNumber'),
      ).toEqual(createdDocketNumbers[2]);
      expect(integrationTest.getState('trialSession.isCalendared')).toEqual(
        false,
      );
    });
  });

  describe('Calendar clerk marks all eligible cases as QCed', () => {
    loginAs(integrationTest, 'petitionsclerk@example.com');
    markAllCasesAsQCed(integrationTest, () => [
      createdDocketNumbers[0],
      createdDocketNumbers[1],
      createdDocketNumbers[2],
    ]);
  });

  describe(`Set calendar for '${trialLocation}' session`, () => {
    loginAs(integrationTest, 'petitionsclerk@example.com');
    petitionsClerkSetsATrialSessionsSchedule(integrationTest);
  });

  describe(`Result: Case #1 and #2 are assigned to '${trialLocation}' session`, () => {
    loginAs(integrationTest, 'petitionsclerk@example.com');

    it(`Case #1 and #2 are assigned to '${trialLocation}' session`, async () => {
      await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: integrationTest.trialSessionId,
      });

      expect(
        integrationTest.getState('trialSession.calendaredCases').length,
      ).toEqual(2);
      expect(integrationTest.getState('trialSession.isCalendared')).toEqual(
        true,
      );
      expect(
        integrationTest.getState('trialSession.calendaredCases.0.docketNumber'),
      ).toEqual(createdDocketNumbers[0]);
      expect(
        integrationTest.getState('trialSession.calendaredCases.1.docketNumber'),
      ).toEqual(createdDocketNumbers[1]);
    });
  });
});
