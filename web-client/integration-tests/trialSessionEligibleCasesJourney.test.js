import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition, wait } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';

const integrationTest = setupTest();
const { CASE_TYPES_MAP, CHIEF_JUDGE, STATUS_TYPES } =
  applicationContext.getConstants();

describe('Trial Session Eligible Cases Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  const trialLocation = `Madison, Wisconsin, ${Date.now()}`;
  const overrides = {
    maxCases: 3,
    preferredTrialCity: trialLocation,
    sessionType: 'Small',
    trialLocation,
  };
  const createdDocketNumbers = [];

  describe(`Create trial session with Small session type for '${trialLocation}' with max case count = 1`, () => {
    loginAs(integrationTest, 'docketclerk@example.com');
    docketClerkCreatesATrialSession(integrationTest, overrides);
    docketClerkViewsTrialSessionList(integrationTest);
    docketClerkViewsNewTrialSession(integrationTest);
  });

  describe('Create cases', () => {
    describe(`Case #1 with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 1/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.deficiency,
        procedureType: 'Small',
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

    describe(`Case #2 with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 1/2/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.deficiency,
        procedureType: 'Small',
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

    describe(`Case #3 with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Regular procedure type with filed date 1/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.deficiency,
        procedureType: 'Regular',
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

    describe(`Case #4 'L' type with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 5/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: CASE_TYPES_MAP.cdp,
        procedureType: 'Small',
      };
      loginAs(integrationTest, 'petitioner@example.com');
      it('Create case #4', async () => {
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

    describe(`Case #5 'P' type with status “General Docket - At Issue (Ready For Trial)” for '${trialLocation}' with Small procedure type with filed date 3/1/2019`, () => {
      const caseOverrides = {
        ...overrides,
        caseType: 'Passport',
        procedureType: 'Small',
      };
      loginAs(integrationTest, 'petitioner@example.com');
      it('Create case #5', async () => {
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

  describe(`Result: Case #4, #5, #1, and #2 should show as eligible for '${trialLocation}' session`, () => {
    loginAs(integrationTest, 'petitionsclerk@example.com');

    it(`Case #4, #5, #1, and #2 should show as eligible for '${trialLocation}' session`, async () => {
      await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: integrationTest.trialSessionId,
      });

      expect(
        integrationTest.getState('trialSession.eligibleCases').length,
      ).toEqual(4);
      const eligibleCases = integrationTest.getState(
        'trialSession.eligibleCases',
      );
      expect(eligibleCases.length).toEqual(4);
      // cases with index 3 and 4 should be first because they are CDP/Passport cases
      expect(eligibleCases[0].docketNumber).toEqual(createdDocketNumbers[3]);
      expect(eligibleCases[1].docketNumber).toEqual(createdDocketNumbers[4]);
      expect(eligibleCases[2].docketNumber).toEqual(createdDocketNumbers[0]);
      expect(eligibleCases[3].docketNumber).toEqual(createdDocketNumbers[1]);
      expect(integrationTest.getState('trialSession.isCalendared')).toEqual(
        false,
      );
    });
  });

  describe(`Mark case #2 as high priority for '${trialLocation}' session`, () => {
    loginAs(integrationTest, 'petitionsclerk@example.com');

    it(`Case #2 should show as first case eligible for '${trialLocation}' session`, async () => {
      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[1],
      });
      expect(integrationTest.getState('caseDetail.status')).not.toEqual(
        STATUS_TYPES.calendared,
      );
      expect(integrationTest.getState('caseDetail').highPriority).toBeFalsy();

      await integrationTest.runSequence('updateModalValueSequence', {
        key: 'reason',
        value: 'just because',
      });

      await integrationTest.runSequence('prioritizeCaseSequence');
      expect(integrationTest.getState('caseDetail').highPriority).toBeTruthy();
      expect(integrationTest.getState('caseDetail').highPriorityReason).toEqual(
        'just because',
      );

      await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: integrationTest.trialSessionId,
      });

      const eligibleCases = integrationTest.getState(
        'trialSession.eligibleCases',
      );
      expect(eligibleCases.length).toEqual(4);
      // this case should be first because it's high priority
      expect(eligibleCases[0].docketNumber).toEqual(createdDocketNumbers[1]);
      // this case should be second because it's a CDP case
      expect(eligibleCases[1].docketNumber).toEqual(createdDocketNumbers[3]);
      // this case should be third because it's a Passport case
      expect(eligibleCases[2].docketNumber).toEqual(createdDocketNumbers[4]);
      expect(eligibleCases[3].docketNumber).toEqual(createdDocketNumbers[0]);
      expect(integrationTest.getState('trialSession.isCalendared')).toEqual(
        false,
      );
    });
  });

  describe(`Remove high priority from case #2 for '${trialLocation}' session`, () => {
    loginAs(integrationTest, 'petitionsclerk@example.com');

    it(`Case #2 should show as last case eligible for '${trialLocation}' session`, async () => {
      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[1],
      });
      expect(integrationTest.getState('caseDetail.status')).not.toEqual(
        STATUS_TYPES.calendared,
      );
      expect(integrationTest.getState('caseDetail').highPriority).toBeTruthy();

      await integrationTest.runSequence('unprioritizeCaseSequence');
      expect(integrationTest.getState('caseDetail').highPriority).toBeFalsy();
      expect(
        integrationTest.getState('caseDetail').highPriorityReason,
      ).toBeFalsy();

      await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: integrationTest.trialSessionId,
      });

      const eligibleCases = integrationTest.getState(
        'trialSession.eligibleCases',
      );
      expect(eligibleCases.length).toEqual(4);
      // this case should be first because it's a CDP case
      expect(eligibleCases[0].docketNumber).toEqual(createdDocketNumbers[3]);
      // this case should be second because it's a Passport case
      expect(eligibleCases[1].docketNumber).toEqual(createdDocketNumbers[4]);
      expect(eligibleCases[2].docketNumber).toEqual(createdDocketNumbers[0]);
      expect(eligibleCases[3].docketNumber).toEqual(createdDocketNumbers[1]);
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
      createdDocketNumbers[3],
      createdDocketNumbers[4],
    ]);
  });

  describe(`Set calendar for '${trialLocation}' session`, () => {
    loginAs(integrationTest, 'petitionsclerk@example.com');
    petitionsClerkSetsATrialSessionsSchedule(integrationTest);
  });

  describe(`Result: Case #4, #5, and #1 are assigned to '${trialLocation}' session and their case statuses are updated to “Calendared for Trial”`, () => {
    loginAs(integrationTest, 'petitionsclerk@example.com');

    it(`Case #4, #5, and #1 are assigned to '${trialLocation}' session`, async () => {
      await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: integrationTest.trialSessionId,
      });

      expect(
        integrationTest.getState('trialSession.calendaredCases').length,
      ).toEqual(3);
      expect(integrationTest.getState('trialSession.isCalendared')).toEqual(
        true,
      );
      expect(
        integrationTest.getState('trialSession.calendaredCases.0.docketNumber'),
      ).toEqual(createdDocketNumbers[3]);
      expect(
        integrationTest.getState('trialSession.calendaredCases.1.docketNumber'),
      ).toEqual(createdDocketNumbers[4]);
      // this could be either case 0 or 1 depending on which was marked eligible first
      expect(
        integrationTest.getState('trialSession.calendaredCases.2.docketNumber'),
      ).toEqual(createdDocketNumbers[0]);
    });

    it(`Case #4, #5, and #1 are assigned to '${trialLocation}' session; Case #2 and #3 are not assigned`, async () => {
      //Case #1 - assigned
      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });
      expect(integrationTest.getState('caseDetail.status')).toEqual(
        STATUS_TYPES.calendared,
      );
      expect(integrationTest.getState('caseDetail.trialLocation')).toEqual(
        trialLocation,
      );
      expect(integrationTest.getState('caseDetail.trialDate')).toEqual(
        '2025-12-12T05:00:00.000Z',
      );
      expect(integrationTest.getState('caseDetail.associatedJudge')).toEqual(
        'Cohen',
      );

      //Case #2 - not assigned
      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[1],
      });
      expect(integrationTest.getState('caseDetail.status')).not.toEqual(
        STATUS_TYPES.calendared,
      );
      expect(
        integrationTest.getState('caseDetail.trialLocation'),
      ).toBeUndefined();
      expect(integrationTest.getState('caseDetail.trialDate')).toBeUndefined();
      expect(integrationTest.getState('caseDetail.associatedJudge')).toEqual(
        CHIEF_JUDGE,
      );

      //Case #3 - not assigned
      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[2],
      });
      expect(integrationTest.getState('caseDetail.status')).not.toEqual(
        STATUS_TYPES.calendared,
      );

      //Case #4 - assigned
      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[3],
      });
      expect(integrationTest.getState('caseDetail.status')).toEqual(
        STATUS_TYPES.calendared,
      );

      //Case #5 - assigned
      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[4],
      });
      expect(integrationTest.getState('caseDetail.status')).toEqual(
        STATUS_TYPES.calendared,
      );
    });

    it(`verify case #1 can be manually removed from '${trialLocation}' session`, async () => {
      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });

      await integrationTest.runSequence('removeCaseFromTrialSequence');

      expect(integrationTest.getState('validationErrors')).toEqual({
        caseStatus: 'Enter a case status',
        disposition: 'Enter a disposition',
      });

      await integrationTest.runSequence(
        'openRemoveFromTrialSessionModalSequence',
        {
          trialSessionId: integrationTest.trialSessionId,
        },
      );

      await integrationTest.runSequence('updateModalValueSequence', {
        key: 'disposition',
        value: 'testing',
      });

      await integrationTest.runSequence('removeCaseFromTrialSequence');

      expect(integrationTest.getState('validationErrors')).toEqual({});

      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });
      expect(integrationTest.getState('caseDetail.status')).not.toEqual(
        STATUS_TYPES.calendared,
      );

      await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: integrationTest.trialSessionId,
      });

      expect(
        integrationTest.getState(
          'trialSession.calendaredCases.2.removedFromTrial',
        ),
      ).toBeTruthy();
    });

    it(`verify case #1 can be manually added back to the '${trialLocation}' session`, async () => {
      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });
      expect(integrationTest.getState('caseDetail.status')).not.toEqual(
        STATUS_TYPES.calendared,
      );

      await integrationTest.runSequence('openAddToTrialModalSequence');
      await integrationTest.runSequence('addCaseToTrialSessionSequence');
      await wait(1000);

      expect(integrationTest.getState('validationErrors')).toEqual({
        trialSessionId: 'Select a Trial Session',
      });

      await integrationTest.runSequence('openAddToTrialModalSequence');
      integrationTest.setState(
        'modal.trialSessionId',
        integrationTest.trialSessionId,
      );

      await integrationTest.runSequence('addCaseToTrialSessionSequence');
      await wait(1000); // we need to wait for some reason

      expect(integrationTest.getState('validationErrors')).toEqual({});

      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: createdDocketNumbers[0],
      });
      expect(integrationTest.getState('caseDetail.status')).toEqual(
        STATUS_TYPES.calendared,
      );

      await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: integrationTest.trialSessionId,
      });

      expect(
        integrationTest.getState(
          'trialSession.calendaredCases.2.removedFromTrial',
        ),
      ).toBeFalsy();

      expect(
        integrationTest.getState(
          'trialSession.calendaredCases.2.isManuallyAdded',
        ),
      ).toBeTruthy();
    });
  });
});
