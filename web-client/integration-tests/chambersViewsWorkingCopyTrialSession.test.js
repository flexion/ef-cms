import { chambersViewsTrialSessionWorkingCopy } from './journey/chambersViewsTrialSessionWorkingCopy';
import { loginAs, setupTest } from './helpers';

const integrationTest = setupTest();

describe('Chambers dashboard', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    integrationTest.trialSessionId = '959c4338-0fac-42eb-b0eb-d53b8d0195cc';
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'colvinsChambers@example.com');
  chambersViewsTrialSessionWorkingCopy(integrationTest);
});
