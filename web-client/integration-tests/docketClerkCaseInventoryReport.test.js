import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { caseInventoryReportHelper as caseInventoryReportHelperComputed } from '../src/presenter/computeds/caseInventoryReportHelper';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const integrationTest = setupTest();

describe('case inventory report journey', () => {
  beforeAll(() => {
    jest.setTimeout(50000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  const initialCaseInventoryCounts = {};
  const createdDocketNumbers = [];
  // eslint-disable-next-line @miovision/disallow-date/no-static-date
  const trialLocation = `Indianapolis, Indiana, ${Date.now()}`;

  loginAs(integrationTest, 'docketclerk@example.com');
  it('cache the initial case inventory counts', async () => {
    await integrationTest.runSequence('openCaseInventoryReportModalSequence');

    const caseInventoryReportHelper = withAppContextDecorator(
      caseInventoryReportHelperComputed,
    );

    const helper = runCompute(caseInventoryReportHelper, {
      state: integrationTest.getState(),
    });

    const legacyJudge = helper.judges.find(
      judge => judge.role === 'legacyJudge',
    );

    expect(legacyJudge).toBeFalsy();

    //New
    await integrationTest.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: CASE_STATUS_TYPES.new,
    });
    await integrationTest.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.new = integrationTest.getState(
      'caseInventoryReportData.totalCount',
    );
    //New, Judge Colvin
    await integrationTest.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: 'Colvin',
    });
    await integrationTest.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.newColvin = integrationTest.getState(
      'caseInventoryReportData.totalCount',
    );
    //Calendared, Judge Colvin
    await integrationTest.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: CASE_STATUS_TYPES.calendared,
    });
    await integrationTest.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.calendaredColvin = integrationTest.getState(
      'caseInventoryReportData.totalCount',
    );
    //Calendared
    await integrationTest.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: '',
    });
    await integrationTest.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.calendared = integrationTest.getState(
      'caseInventoryReportData.totalCount',
    );
    //Judge Colvin
    await integrationTest.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: 'Colvin',
    });
    await integrationTest.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: '',
    });
    await integrationTest.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.colvin = integrationTest.getState(
      'caseInventoryReportData.totalCount',
    );
  });

  //Create a trial session and set as calendared
  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(integrationTest, {
    judge: {
      name: 'Judge Colvin',
      userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
    },
    trialLocation,
  });
  docketClerkViewsTrialSessionList(integrationTest);
  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkSetsATrialSessionsSchedule(integrationTest);

  loginAs(integrationTest, 'petitioner@example.com');
  for (let i = 0; i < 2; i++) {
    it(`create case ${i + 1}`, async () => {
      const caseDetail = await uploadPetition(integrationTest);
      expect(caseDetail.docketNumber).toBeDefined();
      createdDocketNumbers.push(caseDetail.docketNumber);
    });
  }

  loginAs(integrationTest, 'docketclerk@example.com');
  it('manually add first case to the trial session', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: createdDocketNumbers[0],
    });
    await integrationTest.runSequence('openAddToTrialModalSequence');
    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: integrationTest.trialSessionId,
    });
    await integrationTest.runSequence('addCaseToTrialSessionSequence');
  });

  it('get the updated case inventory counts', async () => {
    await refreshElasticsearchIndex();

    //New (+1 from initial)
    await integrationTest.runSequence('openCaseInventoryReportModalSequence');
    await integrationTest.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: CASE_STATUS_TYPES.new,
    });
    await integrationTest.runSequence('submitCaseInventoryReportModalSequence');
    let updatedCaseInventoryCount = integrationTest.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.new + 1,
    );
    //New, Judge Colvin (same as initial)
    await integrationTest.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: 'Colvin',
    });
    await integrationTest.runSequence('submitCaseInventoryReportModalSequence');
    updatedCaseInventoryCount = integrationTest.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.newColvin,
    );
    //Calendared, Judge Colvin (+1 from initial)
    await integrationTest.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: CASE_STATUS_TYPES.calendared,
    });
    await integrationTest.runSequence('submitCaseInventoryReportModalSequence');
    updatedCaseInventoryCount = integrationTest.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.calendaredColvin + 1,
    );
    //Calendared (+1 from initial)
    await integrationTest.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: '',
    });
    await integrationTest.runSequence('submitCaseInventoryReportModalSequence');
    updatedCaseInventoryCount = integrationTest.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.calendared + 1,
    );
    //Judge Colvin (+1 from initial)
    await integrationTest.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: 'Colvin',
    });
    await integrationTest.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: '',
    });
    await integrationTest.runSequence('submitCaseInventoryReportModalSequence');
    updatedCaseInventoryCount = integrationTest.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.colvin + 1,
    );
  });

  it('view the printable report', async () => {
    await integrationTest.runSequence(
      'gotoPrintableCaseInventoryReportSequence',
    );
  });
});
