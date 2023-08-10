import {
  COURT_ISSUED_EVENT_CODES,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
} from '../../entities/EntityConstants';
import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportFilters } from './getTrialSessionsForJudgeActivityReportInteractor';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import { OrdersAndOpinionResultCountTypes } from '../../../../../web-client/src/presenter/judgeActivityReportState';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';

export const getOpinionsFiledByJudgeInteractor = async (
  applicationContext: IApplicationContext,
  params: JudgeActivityReportFilters,
): Promise<OrdersAndOpinionResultCountTypes[]> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch(params);

  if (!searchEntity.isValid()) {
    throw new InvalidRequest();
  }

  const { aggregations }: { aggregations: any } = await applicationContext
    .getPersistenceGateway()
    .fetchEventCodesAggregationForJudges({
      applicationContext,
      params: {
        documentEventCodes: OPINION_EVENT_CODES_WITH_BENCH_OPINION,
        endDate: searchEntity.endDate,
        judges: searchEntity.judges,
        searchType: 'opinion',
        startDate: searchEntity.startDate,
      },
    });

  const computedAggregatedOpinionEventCodes =
    aggregations.search_field_count.buckets.map(bucketObj => ({
      count: bucketObj.doc_count,
      documentType: COURT_ISSUED_EVENT_CODES.find(
        event => event.eventCode === bucketObj.key,
      ).documentType,
      eventCode: bucketObj.key,
    }));

  return computedAggregatedOpinionEventCodes;
};
