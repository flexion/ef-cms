import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { computeStatisticDatesAction } from './computeStatisticDatesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('computeStatisticDatesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('creates date from form month, day, year fields for each statistic in the array if they are present', async () => {
    const result = await runAction(computeStatisticDatesAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          statistics: [
            {
              lastDateOfPeriodDay: '6',
              lastDateOfPeriodMonth: '5',
              lastDateOfPeriodYear: '2017',
            },
            {
              year: '2012',
            },
          ],
        },
      },
    });

    expect(result.state.form.statistics[0].lastDateOfPeriod).toEqual(
      '2017-05-06T04:00:00.000Z',
    );
    expect(result.state.form.statistics[1]).toEqual({ year: '2012' });
  });

  it('does not attempt to calculate statistic dates if statistics array is not present on the form', async () => {
    const result = await runAction(computeStatisticDatesAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(result.state.form.statistics).toEqual([]);
  });

  it('filters out empty statistics', async () => {
    const result = await runAction(computeStatisticDatesAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          statistics: [
            {
              yearOrPeriod: 'Year',
            },
            {
              yearOrPeriod: 'Year',
            },
          ],
        },
      },
    });

    expect(result.state.form.statistics).toEqual([]);
  });

  it('appends default statistic if deficiency and hasVerifiedIrsNotice', async () => {
    const result = await runAction(computeStatisticDatesAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          caseType: 'Deficiency',
          hasVerifiedIrsNotice: true,
          statistics: [
            {
              yearOrPeriod: 'Year',
            },
            {
              yearOrPeriod: 'Year',
            },
          ],
        },
      },
    });

    expect(result.state.form.statistics).toEqual([
      {
        yearOrPeriod: 'Year',
      },
    ]);
  });
});
