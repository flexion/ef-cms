import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkEditsTrialSession } from './journey/docketClerkEditsTrialSession';
import { docketClerkUpdatesCaseStatusToClosed } from './journey/docketClerkUpdatesCaseStatusToClosed';
import { docketClerkVerifiesCaseStatusIsUnchanged } from './journey/docketClerkVerifiesCaseStatusIsUnchanged';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkManuallyAddsCaseToTrial } from './journey/petitionsClerkManuallyAddsCaseToTrial';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';

const integrationTest = setupTest();

describe('Docket Clerk edits a calendared trial session', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  const trialLocation = `Helena, Montana, ${Date.now()}`;

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(integrationTest, {
    trialLocation,
  });
  docketClerkViewsTrialSessionList(integrationTest);

  let caseDetail;
  integrationTest.casesReadyForTrial = [];

  for (let i = 0; i < 3; i++) {
    loginAs(integrationTest, 'petitioner@example.com');
    it('login as a petitioner and create 3 cases', async () => {
      caseDetail = await uploadPetition(integrationTest);
      expect(caseDetail.docketNumber).toBeDefined();
      integrationTest.casesReadyForTrial.push({
        docketNumber: caseDetail.docketNumber,
      });
      integrationTest.docketNumber = caseDetail.docketNumber;
    });

    loginAs(integrationTest, 'petitionsclerk@example.com');
    petitionsClerkManuallyAddsCaseToTrial(integrationTest);
  }

  it('verify that there are 3 cases on the trial session', async () => {
    await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: integrationTest.trialSessionId,
    });

    expect(integrationTest.getState('trialSession.caseOrder').length).toBe(3);
  });

  markAllCasesAsQCed(integrationTest, () =>
    integrationTest.casesReadyForTrial.map(d => d.docketNumber),
  );
  petitionsClerkSetsATrialSessionsSchedule(integrationTest);

  it('verify that there are 3 cases on the trial session', async () => {
    await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: integrationTest.trialSessionId,
    });

    expect(integrationTest.getState('trialSession.caseOrder').length).toBe(3);
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToClosed(integrationTest);

  const overrides = {
    fieldToUpdate: 'judge',
    valueToUpdate: {
      name: 'Gustafson',
      userId: 'dabbad05-18d0-43ec-bafb-654e83405416',
    },
  };
  docketClerkEditsTrialSession(integrationTest, overrides);

  it('verify that there are 3 cases on the trial session', async () => {
    await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: integrationTest.trialSessionId,
    });

    expect(integrationTest.getState('trialSession.caseOrder').length).toBe(3);
  });

  docketClerkVerifiesCaseStatusIsUnchanged(integrationTest);
});
