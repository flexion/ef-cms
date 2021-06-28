import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { runCompute } from 'cerebral/test';
import { statisticsFormHelper as statisticsFormHelperComputed } from '../src/presenter/computeds/statisticsFormHelper';
import { withAppContextDecorator } from '../src/withAppContext';

import { loginAs, setupTest, uploadPetition } from './helpers';

const { CASE_TYPES_MAP } = applicationContext.getConstants();
const integrationTest = setupTest();

const statisticsFormHelper = withAppContextDecorator(
  statisticsFormHelperComputed,
);

describe('Docket Clerk Verifies Docket Record Display', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  const caseOverrides = {
    caseType: CASE_TYPES_MAP.cdp,
    procedureType: 'Small',
  };

  loginAs(integrationTest, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(integrationTest, caseOverrides);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkSubmitsCaseToIrs(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  it('changes the case type to deficiency with irs notice', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('gotoEditCaseDetailsSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    let statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: integrationTest.getState(),
    });

    expect(statisticsUiHelper.showStatisticsForm).toEqual(false);

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.deficiency,
    });

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: integrationTest.getState(),
    });

    expect(statisticsUiHelper.showStatisticsForm).toEqual(true);

    await integrationTest.runSequence('updateCaseDetailsSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      statistics: '"statistics" must contain at least 1 items',
    });

    await integrationTest.runSequence('addStatisticToFormSequence');

    await integrationTest.runSequence('updateCaseDetailsSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      statistics: [
        {
          enterAllValues: 'Enter year, deficiency amount, and total penalties',
          index: 0,
        },
      ],
    });

    await integrationTest.runSequence('updateStatisticsFormValueSequence', {
      key: 'statistics.0.year',
      value: 2019,
    });

    await integrationTest.runSequence('updateStatisticsFormValueSequence', {
      key: 'statistics.0.irsDeficiencyAmount',
      value: 100,
    });

    await integrationTest.runSequence('updateStatisticsFormValueSequence', {
      key: 'statistics.0.irsTotalPenalties',
      value: 100,
    });

    await integrationTest.runSequence('updateCaseDetailsSequence');

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    expect(integrationTest.getState('alertSuccess').message).toEqual(
      'Changes saved.',
    );
    expect(integrationTest.getState('caseDetail.statistics').length).toEqual(1);
  });
});
