import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { docketClerkViewsTrialSessionsTab } from './journey/docketClerkViewsTrialSessionsTab';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkManuallyAddsCaseToTrial } from './journey/petitionsClerkManuallyAddsCaseToTrial';
import { petitionsClerkManuallyRemovesCaseFromTrial } from './journey/petitionsClerkManuallyRemovesCaseFromTrial';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { petitionsClerkViewsATrialSessionsEligibleCases } from './journey/petitionsClerkViewsATrialSessionsEligibleCases';

const integrationTest = setupTest();

describe('Docket Clerk Views Trial Session Tabs', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  const caseCount = 2;
  const trialLocation = `Albuquerque, New Mexico, ${Date.now()}`;
  const overrides = {
    preferredTrialCity: trialLocation,
    trialLocation,
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
  // Trial Session should exist in New tab
  docketClerkViewsTrialSessionsTab(integrationTest, { tab: 'New' });

  for (let i = 0; i < caseCount; i++) {
    const id = i + 1;
    makeCaseReadyForTrial(integrationTest, id, overrides);
  }

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkViewsATrialSessionsEligibleCases(integrationTest, caseCount);

  petitionsClerkManuallyAddsCaseToTrial(integrationTest);
  // only mark cases 0 and 1 as QCed
  markAllCasesAsQCed(integrationTest, () => {
    return [createdDocketNumbers[1]];
  });
  petitionsClerkSetsATrialSessionsSchedule(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  // Trial Session should exist in Open tab
  docketClerkViewsTrialSessionsTab(integrationTest, { tab: 'Open' });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkManuallyRemovesCaseFromTrial(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  // Trial Session should exist in Closed tab
  docketClerkViewsTrialSessionsTab(integrationTest, { tab: 'Closed' });
  // Trial Session should exist in All tab
  docketClerkViewsTrialSessionsTab(integrationTest, { tab: 'All' });
});
