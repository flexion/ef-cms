import { CASE_TYPES_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { Statistic } from '../../../shared/src/business/entities/Statistic';

export const petitionsClerkAddsDeficiencyStatisticToCase = integrationTest => {
  return it('petitions clerk adds deficiency statistic to case after QCing', async () => {
    // set up case to allow statistics to be entered
    await integrationTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: integrationTest.docketNumber,
      tab: 'IrsNotice',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.deficiency,
    });
    await integrationTest.runSequence('refreshStatisticsSequence');
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'statistics.0.year',
      value: 2019,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'statistics.0.irsDeficiencyAmount',
      value: 1000,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'statistics.0.irsTotalPenalties',
      value: 100,
    });
    await integrationTest.runSequence('saveSavedCaseForLaterSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('gotoAddDeficiencyStatisticsSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'AddDeficiencyStatistics',
    );

    const statisticsBefore = integrationTest.getState('caseDetail.statistics');

    expect(integrationTest.getState('form')).toEqual({
      yearOrPeriod: 'Year',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'year',
      value: 2019,
    });

    await integrationTest.runSequence('submitAddDeficiencyStatisticsSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      irsDeficiencyAmount:
        Statistic.VALIDATION_ERROR_MESSAGES.irsDeficiencyAmount,
      irsTotalPenalties: Statistic.VALIDATION_ERROR_MESSAGES.irsTotalPenalties,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsDeficiencyAmount',
      value: 1234,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsTotalPenalties',
      value: 0,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'determinationDeficiencyAmount',
      value: 987,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'determinationTotalPenalties',
      value: 22.33,
    });

    await integrationTest.runSequence('submitAddDeficiencyStatisticsSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    expect(
      integrationTest.getState(
        'currentViewMetadata.caseDetail.caseInformationTab',
      ),
    ).toEqual('statistics');

    const statisticsAfter = integrationTest.getState('caseDetail.statistics');

    expect(statisticsAfter.length).toEqual(statisticsBefore.length + 1);
  });
};
