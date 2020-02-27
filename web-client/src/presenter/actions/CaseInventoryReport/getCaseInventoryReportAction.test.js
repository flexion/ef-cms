import { getCaseInventoryReportAction } from './getCaseInventoryReportAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('getCaseInventoryReportAction', () => {
  let applicationContext;
  const getCaseInventoryReportInteractorMock = jest
    .fn()
    .mockReturnValue({ totalCases: 12 });

  beforeEach(() => {
    jest.clearAllMocks();

    applicationContext = {
      getUseCases: () => ({
        getCaseInventoryReportInteractor: getCaseInventoryReportInteractorMock,
      }),
    };
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the use case with params from screenMetadata and set the results on state', async () => {
    const result = await runAction(getCaseInventoryReportAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: {
          associatedJudge: 'Chief Judge',
          status: 'New',
        },
      },
    });

    expect(getCaseInventoryReportInteractorMock).toBeCalledWith({
      applicationContext: expect.anything(),
      associatedJudge: 'Chief Judge',
      status: 'New',
    });
    expect(result.state.caseInventoryReportData).toEqual({ totalCases: 12 });
  });
});
