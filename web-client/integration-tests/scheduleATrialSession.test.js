import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkManuallyAddsCaseToTrial } from './journey/petitionsClerkManuallyAddsCaseToTrial';
import { petitionsClerkManuallyAddsCaseToTrialWithoutJudge } from './journey/petitionsClerkManuallyAddsCaseToTrialWithoutJudge';
import { petitionsClerkManuallyRemovesCaseFromTrial } from './journey/petitionsClerkManuallyRemovesCaseFromTrial';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { petitionsClerkViewsACalendaredTrialSession } from './journey/petitionsClerkViewsACalendaredTrialSession';
import { petitionsClerkViewsATrialSessionsEligibleCases } from './journey/petitionsClerkViewsATrialSessionsEligibleCases';
import { petitionsClerkViewsATrialSessionsEligibleCasesWithManuallyAddedCase } from './journey/petitionsClerkViewsATrialSessionsEligibleCasesWithManuallyAddedCase';

const integrationTest = setupTest();

describe('Schedule A Trial Session', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  const caseCount = 2;
  const trialLocation = `Albuquerque, New Mexico, ${Date.now()}`;
  const trialLocation2 = `Boise, Idaho, ${Date.now()}`;
  const overrides = {
    preferredTrialCity: trialLocation,
    trialLocation,
  };
  const overrides2 = {
    judge: {},
    preferredTrialCity: trialLocation2,
    trialLocation: trialLocation2,
  };

  integrationTest.casesReadyForTrial = [];

  const createdDocketNumbers = [];

  const makeCaseReadyForTrial = (testSession, id, caseOverrides) => {
    loginAs(testSession, 'petitioner@example.com');
    it(`Create case ${id}`, async () => {
      const caseDetail = await uploadPetition(testSession, caseOverrides);
      expect(caseDetail.docketNumber).toBeDefined();
      createdDocketNumbers.push(caseDetail.docketNumber);
      testSession.docketNumber = caseDetail.docketNumber;
    });

    loginAs(integrationTest, 'petitionsclerk@example.com');
    petitionsClerkSubmitsCaseToIrs(integrationTest);

    loginAs(integrationTest, 'docketclerk@example.com');
    docketClerkSetsCaseReadyForTrial(integrationTest);
  };

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(integrationTest, overrides);
  docketClerkViewsTrialSessionList(integrationTest);
  docketClerkViewsNewTrialSession(integrationTest);

  for (let i = 0; i < caseCount; i++) {
    const id = i + 1;
    makeCaseReadyForTrial(integrationTest, id, overrides);
  }

  // Add case with a different city
  makeCaseReadyForTrial(integrationTest, caseCount + 1, {});

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkViewsATrialSessionsEligibleCases(integrationTest, caseCount);

  petitionsClerkManuallyAddsCaseToTrial(integrationTest);
  petitionsClerkViewsATrialSessionsEligibleCasesWithManuallyAddedCase(
    integrationTest,
    caseCount + 1,
  );
  petitionsClerkManuallyRemovesCaseFromTrial(integrationTest);
  petitionsClerkViewsATrialSessionsEligibleCases(integrationTest, caseCount);
  petitionsClerkManuallyAddsCaseToTrial(integrationTest);

  // only mark cases 0 and 1 as QCed
  markAllCasesAsQCed(integrationTest, () => {
    return [createdDocketNumbers[0], createdDocketNumbers[1]];
  });

  petitionsClerkSetsATrialSessionsSchedule(integrationTest);
  // only 2 cases should have been calendared because only 2 were marked as QCed
  petitionsClerkViewsACalendaredTrialSession(integrationTest, caseCount);

  // create a trial session without a judge
  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(integrationTest, overrides2);
  docketClerkViewsTrialSessionList(integrationTest);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  makeCaseReadyForTrial(integrationTest, caseCount + 2, overrides2);
  petitionsClerkManuallyAddsCaseToTrialWithoutJudge(integrationTest);
});
