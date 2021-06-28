import { BENCH_OPINION_EVENT_CODE } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserViewsTodaysOrdersWithoutBenchOpinion =
  integrationTest => {
    return it('should view todays orders and should not see a bench opinion', async () => {
      await refreshElasticsearchIndex();

      await integrationTest.runSequence('gotoTodaysOrdersSequence', {});

      const todaysOrders = integrationTest.getState('todaysOrders.results');

      const foundBenchOpinion = todaysOrders.find(
        d => d.eventCode === BENCH_OPINION_EVENT_CODE,
      );

      expect(foundBenchOpinion).toBeUndefined();
    });
  };
