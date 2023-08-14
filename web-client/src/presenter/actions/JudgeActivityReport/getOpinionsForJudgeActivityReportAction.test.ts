import { applicationContextForClient as applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getOpinionsForJudgeActivityReportAction } from './getOpinionsForJudgeActivityReportAction';
import { judgeUser } from '@shared/test/mockUsers';
import { mockOpinionsAggregated } from '@shared/business/useCases/judgeActivityReport/getOpinionsFiledByJudgeInteractor.test';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getOpinionsForJudgeActivityReportAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const mockStartDate = '02/20/2021';
  const mockEndDate = '03/03/2021';
  const mockJudgeName = judgeUser.name;

  applicationContext
    .getUseCases()
    .getOpinionsFiledByJudgeInteractor.mockReturnValue(mockOpinionsAggregated);

  it('should make a call to return opinions by the provided judge in the date range provided from persistence', async () => {
    const result = await runAction(getOpinionsForJudgeActivityReportAction, {
      modules: {
        presenter,
      },
      state: {
        judgeActivityReport: {
          filters: {
            endDate: mockEndDate,
            judges: [mockJudgeName],
            startDate: mockStartDate,
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().getOpinionsFiledByJudgeInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      endDate: mockEndDate,
      judges: [mockJudgeName],
      startDate: mockStartDate,
    });

    expect(result.output.opinions).toEqual(mockOpinionsAggregated);
  });
});
