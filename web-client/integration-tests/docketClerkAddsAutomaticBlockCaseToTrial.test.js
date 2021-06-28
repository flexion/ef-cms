import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../src/presenter/computeds/caseDetailHeaderHelper';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { fakeFile, loginAs, setupTest } from './helpers';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { petitionsClerkCreatesACaseDeadline } from './journey/petitionsClerkCreatesACaseDeadline';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkManuallyAddsCaseToTrial } from './journey/petitionsClerkManuallyAddsCaseToTrial';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);
const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderHelperComputed,
);

const integrationTest = setupTest();

describe('Adds automatic block case to trial', () => {
  beforeAll(() => {
    jest.setTimeout(50000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  const trialLocation = `Charleston, West Virginia, ${Date.now()}`;
  const overrides = {
    trialLocation,
  };

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(integrationTest, fakeFile, trialLocation);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkSetsCaseReadyForTrial(integrationTest);
  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(integrationTest, overrides);
  docketClerkViewsTrialSessionList(integrationTest);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  // automatic block with a due date
  petitionsClerkCreatesACaseDeadline(integrationTest);
  integrationTest.casesReadyForTrial = [];
  petitionsClerkManuallyAddsCaseToTrial(integrationTest);

  it('should be able to add a trial session to an automatically blocked case', async () => {
    const formattedCase = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });
    const headerHelper = runCompute(caseDetailHeaderHelper, {
      state: integrationTest.getState(),
    });

    expect(headerHelper.showBlockedTag).toBeTruthy();
    expect(formattedCase.automaticBlocked).toBeTruthy();
  });
});
