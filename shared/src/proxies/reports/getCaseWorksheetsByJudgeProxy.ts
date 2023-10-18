import { ClientApplicationContext } from '@web-client/applicationContext';
import {
  GetCasesByStatusAndByJudgeRequest,
  GetCasesByStatusAndByJudgeResponse,
} from '@shared/business/useCases/judgeActivityReport/getCaseWorksheetsByJudgeInteractor';
import { get } from '../requests';

export const getCaseWorksheetsByJudgeInteractor = (
  applicationContext: ClientApplicationContext,
  params: GetCasesByStatusAndByJudgeRequest,
): Promise<{
  cases: GetCasesByStatusAndByJudgeResponse[];
}> => {
  return get({
    applicationContext,
    endpoint: '/case-worksheets',
    params,
  });
};
