import { docketClerkAddsCaseToHearing } from './journey/docketClerkAddsCaseToHearing';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkEditsHearingNote } from './journey/docketClerkEditsHearingNote';
import { docketClerkManuallyAddsCaseToTrialSessionWithNote } from './journey/docketClerkManuallyAddsCaseToTrialSessionWithNote';
import { docketClerkRemovesCaseFromHearing } from './journey/docketClerkRemovesCaseFromHearing';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { judgeViewsTrialSessionWorkingCopy } from './journey/judgeViewsTrialSessionWorkingCopy';
import { petitionsClerkBlocksCase } from './journey/petitionsClerkBlocksCase';
import { petitionsClerkPrioritizesCase } from './journey/petitionsClerkPrioritizesCase';

import { loginAs, setupTest, uploadPetition } from './helpers';

const integrationTest = setupTest();

describe('trial hearings journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  const trialLocation1 = `Denver, Colorado, ${Date.now()}`;
  const overrides1 = {
    maxCases: 3,
    preferredTrialCity: trialLocation1,
    sessionType: 'Small',
    trialLocation: trialLocation1,
  };
  const trialLocation2 = `Biloxi, Mississippi, ${Date.now()}`;
  const overrides2 = {
    maxCases: 3,
    preferredTrialCity: trialLocation2,
    sessionType: 'Small',
    trialLocation: trialLocation2,
  };
  integrationTest.createdTrialSessions = [];
  integrationTest.createdCases = [];

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(integrationTest, overrides1);
  docketClerkViewsTrialSessionList(integrationTest);
  docketClerkViewsNewTrialSession(integrationTest);
  docketClerkCreatesATrialSession(integrationTest, overrides2);
  docketClerkViewsTrialSessionList(integrationTest);
  docketClerkViewsNewTrialSession(integrationTest);

  loginAs(integrationTest, 'petitioner@example.com');
  it('create case 1', async () => {
    const caseDetail = await uploadPetition(integrationTest, overrides1);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
    integrationTest.createdCases.push(integrationTest.docketNumber);
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkManuallyAddsCaseToTrialSessionWithNote(integrationTest);
  docketClerkAddsCaseToHearing(integrationTest, 'Test hearing note one.');
  docketClerkViewsNewTrialSession(
    integrationTest,
    true,
    'Test hearing note one.',
  );

  loginAs(integrationTest, 'judgeCohen@example.com');
  judgeViewsTrialSessionWorkingCopy(
    integrationTest,
    true,
    'Test hearing note one.',
  );

  loginAs(integrationTest, 'petitioner@example.com');
  it('create case 2', async () => {
    const caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
    integrationTest.createdCases.push(integrationTest.docketNumber);
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkPrioritizesCase(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkAddsCaseToHearing(integrationTest, 'Test hearing note two.');
  docketClerkViewsNewTrialSession(
    integrationTest,
    true,
    'Test hearing note two.',
  );

  loginAs(integrationTest, 'petitioner@example.com');
  it('create case 3', async () => {
    const caseDetail = await uploadPetition(integrationTest, {
      preferredTrialCity: trialLocation1,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
    integrationTest.createdCases.push(integrationTest.docketNumber);
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkBlocksCase(integrationTest, trialLocation1, {
    caseCaption: 'Mona Schultz, Petitioner',
    caseStatus: 'New',
    docketNumberSuffix: 'L',
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkAddsCaseToHearing(integrationTest, 'Test hearing note three.');
  docketClerkViewsNewTrialSession(
    integrationTest,
    true,
    'Test hearing note three.',
  );

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkAddsCaseToHearing(integrationTest, 'Test hearing note four.');
  docketClerkEditsHearingNote(
    integrationTest,
    'Updated test hearing note four.',
  );
  docketClerkRemovesCaseFromHearing(integrationTest);
});
