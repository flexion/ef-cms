import { AUTOMATIC_BLOCKED_REASONS } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import {
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadProposedStipulatedDecision,
  viewCaseDetail,
} from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkBlocksCase } from './journey/petitionsClerkBlocksCase';
import { petitionsClerkCreatesACaseDeadline } from './journey/petitionsClerkCreatesACaseDeadline';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkDeletesCaseDeadline } from './journey/petitionsClerkDeletesCaseDeadline';
import { petitionsClerkRemovesPendingItemFromCase } from './journey/petitionsClerkRemovesPendingItemFromCase';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkUnblocksCase } from './journey/petitionsClerkUnblocksCase';
import { petitionsClerkViewsATrialSessionsEligibleCases } from './journey/petitionsClerkViewsATrialSessionsEligibleCases';

const integrationTest = setupTest();

describe('Blocking a Case', () => {
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
  //manual block and unblock - check eligible list
  petitionsClerkViewsATrialSessionsEligibleCases(integrationTest, 1);
  petitionsClerkBlocksCase(integrationTest, trialLocation);
  petitionsClerkViewsATrialSessionsEligibleCases(integrationTest, 0);
  petitionsClerkUnblocksCase(integrationTest, trialLocation);
  petitionsClerkViewsATrialSessionsEligibleCases(integrationTest, 1);

  // automatic block with a due date
  petitionsClerkCreatesACaseDeadline(integrationTest);

  it('petitions clerk views blocked report with an automatically blocked case for due date', async () => {
    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoBlockedCasesReportSequence');

    await integrationTest.runSequence(
      'getBlockedCasesByTrialLocationSequence',
      {
        key: 'trialLocation',
        value: trialLocation,
      },
    );

    expect(integrationTest.getState('blockedCases')).toMatchObject([
      {
        automaticBlocked: true,
        automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate,
        blocked: false,
        docketNumber: integrationTest.docketNumber,
      },
    ]);
  });

  petitionsClerkRemovesPendingItemFromCase(integrationTest);
  petitionsClerkViewsATrialSessionsEligibleCases(integrationTest, 0);
  petitionsClerkDeletesCaseDeadline(integrationTest);
  petitionsClerkViewsATrialSessionsEligibleCases(integrationTest, 1);

  //automatic block with a pending item
  loginAs(integrationTest, 'irsPractitioner@example.com');

  it('respondent uploads a proposed stipulated decision (pending item)', async () => {
    await viewCaseDetail({
      docketNumber: setupTest.docketNumber,
      integrationTest,
    });
    await uploadProposedStipulatedDecision(integrationTest);
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  it('petitions clerk views blocked report with an automatically blocked case for pending item', async () => {
    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoBlockedCasesReportSequence');

    await integrationTest.runSequence(
      'getBlockedCasesByTrialLocationSequence',
      {
        key: 'trialLocation',
        value: trialLocation,
      },
    );

    expect(integrationTest.getState('blockedCases')).toMatchObject([
      {
        automaticBlocked: true,
        automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
        blocked: false,
        docketNumber: integrationTest.docketNumber,
      },
    ]);
  });
  petitionsClerkViewsATrialSessionsEligibleCases(integrationTest, 0);
  petitionsClerkRemovesPendingItemFromCase(integrationTest);
  petitionsClerkViewsATrialSessionsEligibleCases(integrationTest, 1);

  //automatic and manual block
  petitionsClerkBlocksCase(integrationTest, trialLocation);
  petitionsClerkCreatesACaseDeadline(integrationTest);
  it('petitions clerk views blocked report with an automatically and manually blocked case', async () => {
    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoBlockedCasesReportSequence');

    await integrationTest.runSequence(
      'getBlockedCasesByTrialLocationSequence',
      {
        key: 'trialLocation',
        value: trialLocation,
      },
    );

    expect(integrationTest.getState('blockedCases')).toMatchObject([
      {
        automaticBlocked: true,
        automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.dueDate,
        blocked: true,
        blockedReason: 'just because',
        docketNumber: integrationTest.docketNumber,
      },
    ]);
  });
  petitionsClerkUnblocksCase(integrationTest, trialLocation, false);
  petitionsClerkDeletesCaseDeadline(integrationTest);
  petitionsClerkViewsATrialSessionsEligibleCases(integrationTest, 1);

  //add deadline for a case that was manually added to a non-calendared session - it shouldn't actually be set to blocked
  it('petitions clerk manually adds case to trial', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('openAddToTrialModalSequence');

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'showAllLocations',
      value: true,
    });

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: integrationTest.trialSessionId,
    });

    await integrationTest.runSequence('addCaseToTrialSessionSequence');
    await refreshElasticsearchIndex();
  });

  petitionsClerkCreatesACaseDeadline(integrationTest);
  it('petitions clerk views blocked report with no blocked cases', async () => {
    await integrationTest.runSequence('gotoBlockedCasesReportSequence');

    await refreshElasticsearchIndex();

    await integrationTest.runSequence(
      'getBlockedCasesByTrialLocationSequence',
      {
        key: 'trialLocation',
        value: trialLocation,
      },
    );

    expect(integrationTest.getState('blockedCases')).toMatchObject([]);
  });

  markAllCasesAsQCed(integrationTest, () => [integrationTest.docketNumber]);
  petitionsClerkSetsATrialSessionsSchedule(integrationTest);

  petitionsClerkCreatesACaseDeadline(integrationTest);
  it('petitions clerk views blocked report with no blocked cases', async () => {
    await integrationTest.runSequence('gotoBlockedCasesReportSequence');

    await refreshElasticsearchIndex();

    await integrationTest.runSequence(
      'getBlockedCasesByTrialLocationSequence',
      {
        key: 'trialLocation',
        value: trialLocation,
      },
    );

    expect(integrationTest.getState('blockedCases')).toMatchObject([]);
  });
});
