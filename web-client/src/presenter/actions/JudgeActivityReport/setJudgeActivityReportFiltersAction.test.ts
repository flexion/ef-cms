import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setJudgeActivityReportFiltersAction } from './setJudgeActivityReportFiltersAction';

presenter.providers.applicationContext = applicationContextForClient;

describe('setJudgeActivityReportFiltersAction', () => {
  let filters;
  beforeEach(() => {
    filters = {
      endDate: '',
      judgeName: '',
      startDate: '',
    };
  });
  const testEndDate = '2019-05-17';
  const testStartDate = '2019-05-14';

  it('should set state.judgeActivityReport.filters.startDate to an empty string if formatted props.startDate is an empty string', async () => {
    const result = await runAction(setJudgeActivityReportFiltersAction, {
      modules: { presenter },
      props: {
        startDate: '',
      },
      state: {
        judgeActivityReport: {
          filters: {
            ...filters,
            startDate: 'previous start date',
          },
        },
      },
    });

    expect(result.state.judgeActivityReport.filters.startDate).toEqual('');
  });

  it('should set state.judgeActivityReport.filters.endDate to an empty string if formatted props.endDate is an empty string', async () => {
    const result = await runAction(setJudgeActivityReportFiltersAction, {
      modules: { presenter },
      props: {
        endDate: '',
      },
      state: {
        judgeActivityReport: {
          filters: {
            ...filters,
            endDate: 'previous end date',
          },
        },
      },
    });

    expect(result.state.judgeActivityReport.filters.endDate).toEqual('');
  });

  it('sets state.judgeActivityReport.filters.startDate to the formatted props.startDate', async () => {
    const result = await runAction(setJudgeActivityReportFiltersAction, {
      modules: { presenter },
      props: {
        startDate: testStartDate,
      },
      state: {
        judgeActivityReport: {
          filters,
        },
      },
    });

    expect(result.state.judgeActivityReport.filters.startDate).toEqual(
      testStartDate,
    );
  });
  it('sets state.judgeActivityReport.filters.endDate to the formatted props.endDate', async () => {
    const result = await runAction(setJudgeActivityReportFiltersAction, {
      modules: { presenter },
      props: {
        endDate: testEndDate,
      },
      state: {
        judgeActivityReport: {
          filters,
        },
      },
    });

    expect(result.state.judgeActivityReport.filters.endDate).toEqual(
      testEndDate,
    );
  });

  it('should set state.judgeActivityReport.filters.judgeName to props.judgeName', async () => {
    const result = await runAction(setJudgeActivityReportFiltersAction, {
      modules: { presenter },
      props: {
        judgeName: judgeUser.name,
      },
      state: {
        judgeActivityReport: {
          filters,
        },
      },
    });

    expect(result.state.judgeActivityReport.filters.judgeName).toEqual(
      judgeUser.name,
    );
  });
});
