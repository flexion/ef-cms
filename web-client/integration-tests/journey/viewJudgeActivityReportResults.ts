import {
  formatDateString,
  prepareDateFromString,
} from '../../../shared/src/business/utilities/DateHandler';
import { getConstants } from '../../src/getConstants';
import { judgeActivityReportHelper as judgeActivityReportHelperComputed } from '../../src/presenter/computeds/JudgeActivityReport/judgeActivityReportHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const judgeActivityReportHelper = withAppContextDecorator(
  judgeActivityReportHelperComputed,
);

export const viewJudgeActivityReportResults = (
  cerebralTest: any,
  overrides: { startDate?: string; endDate?: string } = {},
) => {
  return it('should submit the form with valid dates and a judge selection to display judge activity report results and Progress Description Table Results', async () => {
    const currentDate = formatDateString(
      prepareDateFromString(),
      getConstants().DATE_FORMATS.MMDDYYYY,
    );

    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoJudgeActivityReportSequence');
    await cerebralTest.runSequence('setJudgeActivityReportFiltersSequence', {
      startDate: overrides.startDate || '01/01/2020',
    });

    await cerebralTest.runSequence('setJudgeActivityReportFiltersSequence', {
      endDate: overrides.endDate || currentDate,
    });

    await cerebralTest.runSequence('submitJudgeActivityReportSequence');

    const { progressDescriptionTableTotal } = runCompute(
      judgeActivityReportHelper as any,
      {
        state: cerebralTest.getState(),
      },
    );

    cerebralTest.progressDescriptionTableTotal = progressDescriptionTableTotal;

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(
      cerebralTest.getState('judgeActivityReport.judgeActivityReportData'),
    ).toEqual({
      casesClosedByJudge: expect.anything(),
      consolidatedCasesGroupCountMap: expect.anything(),
      opinions: expect.anything(),
      orders: expect.anything(),
      submittedAndCavCasesByJudge: expect.anything(),
      trialSessions: expect.anything(),
    });
  });
};
