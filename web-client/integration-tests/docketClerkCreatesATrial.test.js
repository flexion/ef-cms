import { SESSION_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesARemoteTrialSession } from './journey/docketClerkCreatesARemoteTrialSession';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkEditsTrialSession } from './journey/docketClerkEditsTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest } from './helpers';

const integrationTest = setupTest();

describe('Docket Clerk Creates A Trial', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(integrationTest, {
    trialLocation: 'Peoria, Illinois',
  });
  docketClerkViewsTrialSessionList(integrationTest);
  docketClerkEditsTrialSession(integrationTest);

  const trialLocation = `San Diego, California, ${Date.now()}`;
  docketClerkCreatesARemoteTrialSession(integrationTest, {
    trialLocation,
  });
  docketClerkViewsTrialSessionList(integrationTest);

  docketClerkCreatesARemoteTrialSession(integrationTest, {
    sessionType: SESSION_TYPES.special,
  });
  docketClerkViewsTrialSessionList(integrationTest);
});
