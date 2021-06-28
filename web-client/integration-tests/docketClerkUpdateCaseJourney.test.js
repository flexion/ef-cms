import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkUpdatesCaseStatusFromCalendaredToSubmitted } from './journey/docketClerkUpdatesCaseStatusFromCalendaredToSubmitted';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { docketClerkViewsEligibleCasesForTrialSession } from './journey/docketClerkViewsEligibleCasesForTrialSession';
import { docketClerkViewsInactiveCasesForTrialSession } from './journey/docketClerkViewsInactiveCasesForTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';

const integrationTest = setupTest();

const trialLocation = `Boise, Idaho, ${Date.now()}`;

const overrides = {
  preferredTrialCity: trialLocation,
  trialLocation,
};

describe('docket clerk update case journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');

  it('create a case', async () => {
    const caseDetail = await uploadPetition(integrationTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(integrationTest);
  docketClerkCreatesATrialSession(integrationTest, overrides);
  docketClerkViewsTrialSessionList(integrationTest);
  docketClerkViewsEligibleCasesForTrialSession(integrationTest);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  markAllCasesAsQCed(integrationTest, () => [integrationTest.docketNumber]);
  petitionsClerkSetsATrialSessionsSchedule(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusFromCalendaredToSubmitted(integrationTest);
  docketClerkViewsInactiveCasesForTrialSession(integrationTest);
  docketClerkUpdatesCaseStatusToReadyForTrial(integrationTest);
});
