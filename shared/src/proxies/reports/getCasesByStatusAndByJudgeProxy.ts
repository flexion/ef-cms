import { ClientApplicationContext } from '@web-client/applicationContext';
import {
  GetCasesByStatusAndByJudgeResponse,
  JudgeActivityReportCavAndSubmittedCasesRequest,
} from '@shared/business/useCases/judgeActivityReport/getCasesByStatusAndByJudgeInteractor';
import { get } from '../requests';

export const getCasesByStatusAndByJudgeInteractor = (
  applicationContext: ClientApplicationContext,
  params: JudgeActivityReportCavAndSubmittedCasesRequest,
): Promise<{
  cases: GetCasesByStatusAndByJudgeResponse[];
}> => {
  return get({
    applicationContext,
    endpoint: '/cases/status-and-judge',
    params,
  });
};
