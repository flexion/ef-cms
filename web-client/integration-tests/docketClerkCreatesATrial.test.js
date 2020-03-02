import { loginAs, setupTest } from './helpers';
import docketClerkCreatesATrialSession from './journey/docketClerkCreatesATrialSession';
import docketClerkEditsTrialSession from './journey/docketClerkEditsTrialSession';
import docketClerkViewsTrialSessionList from './journey/docketClerkViewsTrialSessionList';

const test = setupTest();

describe('Docket Clerk Creates A Trial', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });
  loginAs(test, 'docketclerk');
  docketClerkCreatesATrialSession(test);
  docketClerkViewsTrialSessionList(test);
  docketClerkEditsTrialSession(test);
});
