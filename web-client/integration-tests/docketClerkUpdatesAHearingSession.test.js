import { docketClerkAddsCaseToHearing } from './journey/docketClerkAddsCaseToHearing';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkEditsTrialSession } from './journey/docketClerkEditsTrialSession';
import { docketClerkViewsCaseDetail } from './journey/docketClerkViewsCaseDetail';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';

const integrationTest = setupTest();

describe('Docket Clerk updates a hearing session', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  integrationTest.createdTrialSessions = [];

  loginAs(integrationTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  const trialLocation = `Hartford, Connecticut, ${Date.now()}`;
  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(integrationTest, {
    sessionType: 'Motion/Hearing',
    trialLocation,
  });
  docketClerkViewsTrialSessionList(integrationTest);

  docketClerkAddsCaseToHearing(integrationTest, 'Low blast radius', 0);

  docketClerkEditsTrialSession(integrationTest);

  docketClerkViewsCaseDetail(integrationTest);

  it('should NOT set the trialSessionId on the case', () => {
    expect(
      integrationTest.getState('caseDetail.trialSessionId'),
    ).toBeUndefined();
  });
});
