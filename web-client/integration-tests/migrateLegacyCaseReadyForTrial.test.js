import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession.js';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList.js';
import { loginAs, setupTest } from './helpers';

const integrationTest = setupTest();

const TRIAL_CITY = 'Washington, District of Columbia';

describe('Migrate legacy cases that are ready for trial', () => {
  // note: leaving commented code here for documentation reasons
  const SEEDED_DOCKET_NUMBER_UNBLOCKED = '150-12';
  // const SEEDED_DOCKET_NUMBER_BLOCKED = '151-12';
  // const SEEDED_DOCKET_NUMBER_DEADLINE = '152-12';

  const options = {
    maxCases: 100,
    preferredTrialCity: TRIAL_CITY,
    sessionType: 'Hybrid',
    trialLocation: TRIAL_CITY,
  };

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(integrationTest, options);
  docketClerkViewsTrialSessionList(integrationTest);

  it('docket clerk should see migrated case as eligible for trial on session', async () => {
    await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: integrationTest.trialSessionId,
    });

    expect(
      integrationTest.getState('trialSession.eligibleCases').length,
    ).toEqual(1);
    expect(
      integrationTest.getState('trialSession.eligibleCases')[0].docketNumber,
    ).toEqual(SEEDED_DOCKET_NUMBER_UNBLOCKED);
  });
});
