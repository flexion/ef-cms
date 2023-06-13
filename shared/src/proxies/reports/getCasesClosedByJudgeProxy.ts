import { CasesClosedType } from '../../../../web-client/src/presenter/judgeActivityReportState';
import { post } from '../requests';

export const getCasesClosedByJudgeInteractor = (
  applicationContext,
  {
    endDate,
    judgeName,
    startDate,
  }: { startDate: string; endDate: string; judgeName: string },
): Promise<CasesClosedType> => {
  return post({
    applicationContext,
    body: {
      endDate,
      judgeName,
      startDate,
    },
    endpoint: '/judge-activity-report/closed-cases',
  });
};
