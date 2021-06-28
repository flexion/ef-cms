import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { caseDetailEditHelper as caseDetailEditHelperComputed } from '../../src/presenter/computeds/caseDetailEditHelper';
import { reviewSavedPetitionHelper as reviewSavedPetitionHelperComputed } from '../../src/presenter/computeds/reviewSavedPetitionHelper';
import { runCompute } from 'cerebral/test';
import { statisticsFormHelper as statisticsFormHelperComputed } from '../../src/presenter/computeds/statisticsFormHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailEditHelper = withAppContextDecorator(
  caseDetailEditHelperComputed,
);

const reviewSavedPetitionHelper = withAppContextDecorator(
  reviewSavedPetitionHelperComputed,
);

const statisticsFormHelper = withAppContextDecorator(
  statisticsFormHelperComputed,
);

const { CASE_TYPES_MAP } = applicationContext.getConstants();

export const petitionsClerkEditsPetitionInQCIRSNotice = integrationTest => {
  return it('Petitions clerk edits Petition IRS Notice', async () => {
    await integrationTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: integrationTest.docketNumber,
      tab: 'IrsNotice',
    });

    expect(integrationTest.getState('currentPage')).toEqual('PetitionQc');

    // No IRS notice
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: false,
    });

    // Set case type
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.cdp,
    });

    let noticeUiHelper = runCompute(caseDetailEditHelper, {
      state: integrationTest.getState(),
    });

    let statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: integrationTest.getState(),
    });

    expect(noticeUiHelper.shouldShowIrsNoticeDate).toEqual(false);
    expect(statisticsUiHelper.showStatisticsForm).toEqual(false);

    // Has IRS notice
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });

    noticeUiHelper = runCompute(caseDetailEditHelper, {
      state: integrationTest.getState(),
    });

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: integrationTest.getState(),
    });

    expect(noticeUiHelper.shouldShowIrsNoticeDate).toEqual(true);
    expect(statisticsUiHelper.showStatisticsForm).toEqual(false);

    // Set case type to deficiency
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.deficiency,
    });

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: integrationTest.getState(),
    });

    expect(statisticsUiHelper.showStatisticsForm).toEqual(true);

    let statistics = integrationTest.getState('form.statistics');

    expect(statistics.length).toEqual(0);

    // Add statistic
    await integrationTest.runSequence('addStatisticToFormSequence');

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: integrationTest.getState(),
    });

    statistics = integrationTest.getState('form.statistics');

    expect(statistics.length).toEqual(1);
    expect(statisticsUiHelper.showAddMoreStatisticsButton).toEqual(true);

    // Add 11 more statistics (reaching the maximum number of 12)
    for (let i = 1; i < 12; i++) {
      await integrationTest.runSequence('addStatisticToFormSequence');
    }
    statistics = integrationTest.getState('form.statistics');

    expect(statistics.length).toEqual(12);

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: integrationTest.getState(),
    });

    expect(statisticsUiHelper.showAddMoreStatisticsButton).toEqual(false);

    // Attempt to add statistic after max is reached
    await integrationTest.runSequence('addStatisticToFormSequence');
    statistics = integrationTest.getState('form.statistics');

    expect(statistics.length).toEqual(12);

    // Attempt to submit without required statistics fields
    await integrationTest.runSequence('saveSavedCaseForLaterSequence');

    let errors = integrationTest.getState('validationErrors.statistics');

    expect(errors[0].enterAllValues).toContain(
      'Enter year, deficiency amount, and total penalties',
    );

    // Change between a statistic period and year
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'statistics.0.yearOrPeriod',
      value: 'Period',
    });

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: integrationTest.getState(),
    });

    expect(statisticsUiHelper.statisticOptions[0].showYearInput).toBeFalsy();
    expect(statisticsUiHelper.statisticOptions[0].showPeriodInput).toEqual(
      true,
    );

    // Attempt to submit without required (period) statistics fields
    await integrationTest.runSequence('saveSavedCaseForLaterSequence');

    errors = integrationTest.getState('validationErrors.statistics');

    expect(errors[0].enterAllValues).toContain(
      'Enter year, deficiency amount, and total penalties',
    );

    // Switch back to year input
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'statistics.0.yearOrPeriod',
      value: 'Year',
    });

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: integrationTest.getState(),
    });

    expect(statisticsUiHelper.statisticOptions[0].showYearInput).toEqual(true);
    expect(statisticsUiHelper.statisticOptions[0].showPeriodInput).toBeFalsy();

    await integrationTest.runSequence('saveSavedCaseForLaterSequence');

    errors = integrationTest.getState('validationErrors.statistics');

    expect(errors[0].enterAllValues).toContain(
      'Enter year, deficiency amount, and total penalties',
    );

    // Select calculate penalties for the first statistic
    await integrationTest.runSequence('showCalculatePenaltiesModalSequence', {
      statisticIndex: 0,
    });

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: integrationTest.getState(),
    });

    let modal = integrationTest.getState('modal');

    expect(modal.statisticIndex).toEqual(0);
    expect(modal.penalties).toMatchObject(['', '', '', '', '']);
    expect(modal.showModal).toEqual('CalculatePenaltiesModal');
    expect(statisticsUiHelper.showAddAnotherPenaltyButton).toEqual(true);

    // Add 5 more penalty inputs in the modal (reaching the maximum number of 10)
    for (let i = 5; i < 10; i++) {
      await integrationTest.runSequence('addPenaltyInputSequence');
    }

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: integrationTest.getState(),
    });

    modal = integrationTest.getState('modal');

    expect(modal.penalties.length).toEqual(10); // contains 5 additional elements in penalties array
    expect(statisticsUiHelper.showAddAnotherPenaltyButton).toEqual(false); // UI should not allow additional to be created

    // Attempt to add penalty inputs in modal after max is reached
    await integrationTest.runSequence('addPenaltyInputSequence');

    modal = integrationTest.getState('modal');

    expect(modal.penalties.length).toEqual(10);

    // Add some penalties and calculate the sum
    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'penalties.0',
      value: '1',
    });

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'penalties.1',
      value: '2',
    });

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'penalties.2',
      value: '3.01',
    });

    await integrationTest.runSequence('calculatePenaltiesSequence');

    statistics = integrationTest.getState('form.statistics');
    modal = integrationTest.getState('modal');

    expect(statistics[0].irsTotalPenalties).toEqual('$6.01');
    expect(modal.showModal).toBeUndefined();

    // Attempt to insert a non-number into currency amount inputs
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'statistics.0.irsDeficiencyAmount',
      value: '$100',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'statistics.0.irsTotalPenalties',
      value: '1,000',
    });

    await integrationTest.runSequence('saveSavedCaseForLaterSequence');

    errors = integrationTest.getState('validationErrors.statistics');

    expect(errors[0].enterAllValues).toContain(
      'Enter year, deficiency amount, and total penalties',
    );

    // Add 11 more statistics (reaching the maximum number of 12) back to form - they were removed
    // before by empty statistic filtering
    for (let i = 1; i < 12; i++) {
      await integrationTest.runSequence('addStatisticToFormSequence');
    }
    statistics = integrationTest.getState('form.statistics');

    expect(statistics.length).toEqual(12);

    statisticsUiHelper = runCompute(statisticsFormHelper, {
      state: integrationTest.getState(),
    });

    // Fill out all statistics values except the last one and submit
    // -- the last one should be removed from the form because it was not filled in
    for (let i = 0; i < 11; i++) {
      await integrationTest.runSequence('updateFormValueSequence', {
        key: `statistics.${i}.year`,
        value: 2019,
      });

      await integrationTest.runSequence('updateFormValueSequence', {
        key: `statistics.${i}.irsDeficiencyAmount`,
        value: 1000 + i,
      });

      await integrationTest.runSequence('updateFormValueSequence', {
        key: `statistics.${i}.irsTotalPenalties`,
        value: 100 + i,
      });
    }

    await integrationTest.runSequence('saveSavedCaseForLaterSequence');

    errors = integrationTest.getState('validationErrors.statistics');
    expect(errors).toBeUndefined();

    expect(integrationTest.getState('currentPage')).toEqual(
      'ReviewSavedPetition',
    );

    let reviewUiHelper = runCompute(reviewSavedPetitionHelper, {
      state: integrationTest.getState(),
    });

    expect(reviewUiHelper.formattedStatistics).toEqual([
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,000.00',
        formattedIrsTotalPenalties: '$100.00',
        irsDeficiencyAmount: 1000,
        irsTotalPenalties: 100,
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,001.00',
        formattedIrsTotalPenalties: '$101.00',
        irsDeficiencyAmount: 1001,
        irsTotalPenalties: 101,
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,002.00',
        formattedIrsTotalPenalties: '$102.00',
        irsDeficiencyAmount: 1002,
        irsTotalPenalties: 102,
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,003.00',
        formattedIrsTotalPenalties: '$103.00',
        irsDeficiencyAmount: 1003,
        irsTotalPenalties: 103,
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,004.00',
        formattedIrsTotalPenalties: '$104.00',
        irsDeficiencyAmount: 1004,
        irsTotalPenalties: 104,
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,005.00',
        formattedIrsTotalPenalties: '$105.00',
        irsDeficiencyAmount: 1005,
        irsTotalPenalties: 105,
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,006.00',
        formattedIrsTotalPenalties: '$106.00',
        irsDeficiencyAmount: 1006,
        irsTotalPenalties: 106,
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,007.00',
        formattedIrsTotalPenalties: '$107.00',
        irsDeficiencyAmount: 1007,
        irsTotalPenalties: 107,
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,008.00',
        formattedIrsTotalPenalties: '$108.00',
        irsDeficiencyAmount: 1008,
        irsTotalPenalties: 108,
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,009.00',
        formattedIrsTotalPenalties: '$109.00',
        irsDeficiencyAmount: 1009,
        irsTotalPenalties: 109,
        year: 2019,
      }),
      expect.objectContaining({
        formattedIrsDeficiencyAmount: '$1,010.00',
        formattedIrsTotalPenalties: '$110.00',
        irsDeficiencyAmount: 1010,
        irsTotalPenalties: 110,
        year: 2019,
      }),
    ]);
  });
};
