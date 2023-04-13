// import { ROLES } from '../../entities/EntityConstants';
import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import { SESSION_TYPES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { docketClerkUser, judgeUser } from '../../../test/mockUsers';
import { getTrialSessionsForJudgeActivityReportInteractor } from './getTrialSessionsForJudgeActivityReportInteractor';

describe('getTrialSessionsForJudgeActivityReportInteractor', () => {
  const mockRegularTrialSession = {
    ...MOCK_TRIAL_REGULAR,
    endDate: '2020-03-02T00:00:00.000Z',
    judge: {
      name: judgeUser.name,
      userId: judgeUser.userId,
    },
    startDate: '2020-03-01T00:00:00.000Z',
  };

  const mockMotionHearingTrialSession = {
    ...MOCK_TRIAL_REGULAR,
    endDate: '2020-03-03T00:00:00.000Z',
    judge: {
      name: judgeUser.name,
      userId: judgeUser.userId,
    },
    sessionType: SESSION_TYPES.motionHearing,
    startDate: '2020-03-02T00:00:00.000Z',
  };

  const mockTrialSessions = [
    mockRegularTrialSession,
    mockMotionHearingTrialSession,
  ];

  const mockValidRequest = {
    endDate: '04/01/2020',
    judgeId: judgeUser.userId,
    startDate: '01/01/2020',
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockReturnValue(mockTrialSessions);
  });

  it('should throw an error when user is unauthorized to retrieve the judge activity report', async () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    await expect(
      getTrialSessionsForJudgeActivityReportInteractor(
        applicationContext,
        mockValidRequest,
      ),
    ).rejects.toThrow();
  });

  it('should retrieve all trial sessions from persistence for filtering', async () => {
    await getTrialSessionsForJudgeActivityReportInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(
      applicationContext.getPersistenceGateway().getTrialSessions,
    ).toHaveBeenCalled();
  });

  it('should return for each trial session type, the weighted count of sessions held in the date range for the judge provided', async () => {
    const result = await getTrialSessionsForJudgeActivityReportInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result).toEqual({
      Hybrid: 0,
      'Motion/Hearing': 0.5, // .5 for each motion/hearing whose start date is within the date range AND session status is not new
      Regular: 1,
      Small: 0,
      Special: 0,
    });
  });
});
