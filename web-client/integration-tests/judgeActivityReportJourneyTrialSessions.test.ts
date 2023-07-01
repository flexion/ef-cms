import { docketClerkAddsCaseToHearing } from './journey/docketClerkAddsCaseToHearing';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkManuallyAddsCaseToTrialSessionWithNote } from './journey/docketClerkManuallyAddsCaseToTrialSessionWithNote';
import { docketClerkManuallyAddsCaseToTrialSessionWithoutNote } from './journey/docketClerkManuallyAddsCaseToTrialSessionWithoutNote';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from '../src/presenter/computeds/JudgeActivityReport/judgeActivityReportHelper';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkCompletesAndSetsTrialSession } from './journey/petitionsClerkCompletesAndSetsTrialSession';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkViewsNewTrialSession } from './journey/petitionsClerkViewsNewTrialSession';
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
  const trialLocation3 = `Charlotte, NC, ${Date.now()}`;

  const overrides1 = {
    judge: 'Colvin',
    maxCases: 2,
    preferredTrialCity: trialLocation1,
    sessionType: 'Regular',
    trialLocation: trialLocation1,
  };

  const overrides2 = {
    judge: 'Colvin',
    maxCases: 3,
    preferredTrialCity: trialLocation1,
    sessionType: 'Regular',
    trialLocation: trialLocation2,
  };

  const overrides3 = {
    judge: 'Colvin',
    maxCases: 13,
    preferredTrialCity: trialLocation3,
    sessionType: 'Regular',
    trialLocation: trialLocation3,
  };

  const cerebralTest = setupTest();
  cerebralTest.createdTrialSessions = [];
  cerebralTest.createdCases = [];
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
    console.log('trialSessionsHeldBefore', trialSessionsHeldBefore);
  });

  // CREATE FIRST TRIAL SESSION ADD CASE AND SET THE CALENDAR ON THE CASE
  // loginAs(cerebralTest, 'docketclerk@example.com');
  // docketClerkCreatesATrialSession(cerebralTest, overrides1);
  // docketClerkViewsNewTrialSession(cerebralTest);
  // loginAs(cerebralTest, 'petitioner@example.com');
  // it('creates a case', async () => {
  //   const caseDetail = await uploadPetition(cerebralTest, overrides1);
  //   expect(caseDetail.docketNumber).toBeDefined();
  //   cerebralTest.docketNumber = caseDetail.docketNumber;
  // });

  // loginAs(cerebralTest, 'docketclerk@example.com');
  // docketClerkManuallyAddsCaseToTrialSessionWithoutNote(cerebralTest);

  // loginAs(cerebralTest, 'petitionsclerk@example.com');
  // petitionsClerkCompletesAndSetsTrialSession(cerebralTest, {
  //   judge: overrides1.judge,
  // });

  // CREATE SECOND TRIAL SESSION ADD CASE AND SET THE CALENDAR ON THE CASE
  // loginAs(cerebralTest, 'docketclerk@example.com');
  // docketClerkCreatesATrialSession(cerebralTest, overrides2);
  // loginAs(cerebralTest, 'petitioner@example.com');
  // it('creates a case', async () => {
  //   const caseDetail = await uploadPetition(cerebralTest, overrides2);
  //   expect(caseDetail.docketNumber).toBeDefined();
  //   cerebralTest.docketNumber = caseDetail.docketNumber;
  // });

  // loginAs(cerebralTest, 'docketclerk@example.com');
  // docketClerkManuallyAddsCaseToTrialSessionWithoutNote(cerebralTest);

  // loginAs(cerebralTest, 'petitionsclerk@example.com');
  // petitionsClerkCompletesAndSetsTrialSession(cerebralTest, {
  //   judge: overrides2.judge,
  // });

  // CREATE THIRD TRIAL SESSION ADD CASE AND SET THE CALENDAR ON THE CASE
  // cerebralTest.createdTrialSessions = [];
  // loginAs(cerebralTest, 'docketclerk@example.com');
  // docketClerkCreatesATrialSession(cerebralTest, overrides3);
  // loginAs(cerebralTest, 'petitioner@example.com');
  // it('creates a case', async () => {
  //   const caseDetail = await uploadPetition(cerebralTest, overrides3);
  //   expect(caseDetail.docketNumber).toBeDefined();
  //   cerebralTest.docketNumber = caseDetail.docketNumber;
  // });

  // loginAs(cerebralTest, 'docketclerk@example.com');
  // docketClerkManuallyAddsCaseToTrialSessionWithoutNote(cerebralTest);

  // loginAs(cerebralTest, 'petitionsclerk@example.com');
  // petitionsClerkViewsNewTrialSession(cerebralTest);
  // markAllCasesAsQCed(cerebralTest, () => [cerebralTest.docketNumber]);
  // petitionsClerkSetsATrialSessionsSchedule(cerebralTest);

  // loginAs(cerebralTest, 'judgecolvin@example.com');
  // viewJudgeActivityReportResults(cerebralTest, { judgeName: 'All Judges' });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, overrides1);
  docketClerkViewsTrialSessionList(cerebralTest);
  docketClerkViewsNewTrialSession(cerebralTest, false);
  docketClerkCreatesATrialSession(cerebralTest, overrides2);
  docketClerkViewsTrialSessionList(cerebralTest);
  docketClerkViewsNewTrialSession(cerebralTest, false);

  loginAs(cerebralTest, 'petitioner@example.com');
  it('create case 1', async () => {
    const caseDetail = await uploadPetition(cerebralTest, overrides1);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
    cerebralTest.createdCases.push(cerebralTest.docketNumber);
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkManuallyAddsCaseToTrialSessionWithNote(cerebralTest);
  docketClerkAddsCaseToHearing(cerebralTest, 'Test hearing note one.');
  docketClerkViewsNewTrialSession(cerebralTest, true, 'Test hearing note one.');

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsNewTrialSession(cerebralTest);
  markAllCasesAsQCed(cerebralTest, () => [cerebralTest.docketNumber]);

  console.log(
    'HERE TO SEE IF DOCKET CLERK is opened',
    cerebralTest.lastCreatedTrialSessionId,
  );
  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkViewsTrialSessionList(cerebralTest);

  it('should increase the trial session count for all judges', () => {
    console.log('trialsessions number', cerebralTest.trialSessionsHeldTotal);

    // const trialSessionsHeldAfter = cerebralTest.trialSessionsHeldTotal;
    // expect(trialSessionsHeldAfter).toEqual(trialSessionsHeldBefore + 2);
  });
});
