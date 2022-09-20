import { PROCEDURE_TYPES_MAP } from '../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../src/applicationContext';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { petitionsClerkViewsAHybridTrialSessionFilteredEligibleCases } from './journey/petitionsClerkViewsAHybridTrialSessionsFilteredEligibleCases';

const cerebralTest = setupTest();
const { CASE_TYPES_MAP } = applicationContext.getConstants();

// create a trial session
// create four cases : 1 deficiency, 1 lien/levy, 1 small, 1 small lien/levy
// make ready for trial all 4 cases
// view trial session list
// view new trial session list
// view new trial session eligible cases list

describe('Filter A Hybrid Trial Session', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const trialLocation = `Albuquerque, New Mexico, ${Date.now()}`;
  const overrides = {
    preferredTrialCity: trialLocation,
    trialLocation,
  };
  const caseId = 0;
  const caseCount = 4;

  const makeCaseReadyForTrial = (testSession, id, caseOverrides) => {
    loginAs(testSession, 'petitioner@example.com');
    it(`Create case ${id}`, async () => {
      const caseDetail = await uploadPetition(testSession, caseOverrides);
      expect(caseDetail.docketNumber).toBeDefined();
      testSession.docketNumber = caseDetail.docketNumber;
    });

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkSubmitsCaseToIrs(cerebralTest);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkSetsCaseReadyForTrial(cerebralTest);
  };

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, overrides);
  docketClerkViewsTrialSessionList(cerebralTest);
  docketClerkViewsNewTrialSession(cerebralTest);

  makeCaseReadyForTrial(cerebralTest, caseId + 1, overrides);
  makeCaseReadyForTrial(cerebralTest, caseId + 1, {
    ...overrides,
    caseType: CASE_TYPES_MAP.deficiency,
  });
  makeCaseReadyForTrial(cerebralTest, caseId + 1, {
    ...overrides,
    caseType: CASE_TYPES_MAP.deficiency,
    procedureType: PROCEDURE_TYPES_MAP.small,
  });
  makeCaseReadyForTrial(cerebralTest, caseId + 1, {
    ...overrides,
    procedureType: PROCEDURE_TYPES_MAP.small,
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsAHybridTrialSessionFilteredEligibleCases(
    cerebralTest,
    caseCount,
  );

  petitionsClerkViewsAHybridTrialSessionFilteredEligibleCases(
    cerebralTest,
    caseCount,
    'Regular',
  );

  petitionsClerkViewsAHybridTrialSessionFilteredEligibleCases(
    cerebralTest,
    caseCount,
    'Small',
  );
});
