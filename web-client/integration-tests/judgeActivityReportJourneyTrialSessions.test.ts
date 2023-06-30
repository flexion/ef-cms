import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from '../src/presenter/computeds/JudgeActivityReport/judgeActivityReportHelper';
import { loginAs, setupTest } from './helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { viewJudgeActivityReportResults } from './journey/viewJudgeActivityReportResults';
import { withAppContextDecorator } from '../src/withAppContext';

const judgeActivityReportHelper = withAppContextDecorator(
  judgeActivityReportHelperComputed,
);

let trialSessionsHeldBefore = 0;

describe('Judge activity report journey', () => {
  const trialLocation1 = `Despacito, Texas, ${Date.now()}`;
  const trialLocation2 = `Los Angeles, California, ${Date.now()}`;

  const overrides1 = {
    maxCases: 2,
    preferredTrialCity: trialLocation1,
    sessionType: 'Regular',
    trialLocation: trialLocation1,
  };

  const overrides2 = {
    maxCases: 3,
    preferredTrialCity: trialLocation1,
    sessionType: 'Special',
    trialLocation: trialLocation2,
  };

  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'judgecolvin@example.com');
  it('should disable the submit button on initial page load when form has not yet been completed', async () => {
    await cerebralTest.runSequence('gotoJudgeActivityReportSequence');

    const { isFormPristine, reportHeader } = runCompute(
      judgeActivityReportHelper,
      {
        state: cerebralTest.getState(),
      },
    );

    expect(isFormPristine).toBe(true);
    expect(reportHeader).toContain('Colvin');
  });

  it('should display an error message when invalid dates are entered into the form', async () => {
    await cerebralTest.runSequence('setJudgeActivityReportFiltersSequence', {
      startDate: '--_--',
    });

    await cerebralTest.runSequence('setJudgeActivityReportFiltersSequence', {
      endDate: 'yabbadabaadooooo',
    });

    await cerebralTest.runSequence('submitJudgeActivityReportSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      endDate: 'Enter a valid end date.',
      startDate: 'Enter a valid start date.',
    });
  });

  viewJudgeActivityReportResults(cerebralTest);
  it('should set the trialSessionsBefore', () => {
    trialSessionsHeldBefore = cerebralTest.trialSessionsHeldTotal;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, overrides1);
  docketClerkViewsTrialSessionList(cerebralTest);
  docketClerkViewsNewTrialSession(cerebralTest);

  docketClerkCreatesATrialSession(cerebralTest, overrides2);
  docketClerkViewsTrialSessionList(cerebralTest);
  docketClerkViewsNewTrialSession(cerebralTest);

  loginAs(cerebralTest, 'judgecolvin@example.com');
  viewJudgeActivityReportResults(cerebralTest, { judgeName: 'All Judges' });
  it('should increase the trial session count for all judges', () => {
    const trialSessionsHeldAfter = cerebralTest.trialSessionsHeldTotal;
    expect(trialSessionsHeldAfter).toEqual(trialSessionsHeldBefore + 2);
  });
});
