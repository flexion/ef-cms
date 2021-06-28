import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { sortTodaysOrdersSequence } from './sortTodaysOrdersSequence';

describe('sortTodaysOrdersSequence', () => {
  let integrationTest;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      sortTodaysOrdersSequence,
    };

    applicationContext.getUseCases().getTodaysOrdersInteractor.mockReturnValue({
      results: ['newly', 'sorted', 'results'],
      totalCount: 3,
    });

    integrationTest = CerebralTest(presenter);
  });

  it('should always unset page number before requesting search results', async () => {
    integrationTest.setState('sessionMetadata.todaysOrdersSort', {
      todaysOrdersSort: 'filingDateDesc',
    });
    integrationTest.setState('todaysOrders', {
      page: 7,
      results: ['some', 'results'],
    });

    await integrationTest.runSequence('sortTodaysOrdersSequence', {
      key: 'todaysOrdersSort',
      value: 'filingDate',
    });

    expect(integrationTest.getState('sessionMetadata.todaysOrdersSort')).toBe(
      'filingDate',
    );
    expect(
      applicationContext.getUseCases().getTodaysOrdersInteractor,
    ).toHaveBeenCalledWith(
      { context: expect.anything() },
      {
        page: 1,
        todaysOrdersSort: 'filingDate',
      },
    );
    expect(integrationTest.getState('todaysOrders')).toMatchObject({
      page: 2,
      results: ['newly', 'sorted', 'results'],
    });
  });
});
