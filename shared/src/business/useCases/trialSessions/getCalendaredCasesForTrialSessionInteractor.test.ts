import { applicationContext } from '../../test/createTestApplicationContext';
import { getCalendaredCasesForTrialSessionInteractor } from './getCalendaredCasesForTrialSessionInteractor';
import { MOCK_CASE } from '../../../test/mockCase';
import { PARTY_TYPES, ROLES } from '../../entities/EntityConstants';
import { UnauthorizedError } from '../../../errors/errors';
import { User } from '../../entities/User';

const mockJudge = {
  role: ROLES.judge,
  section: 'judgeChambers',
  userId: '123',
};

let user;

describe('getCalendaredCasesForTrialSessionInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockImplementation(() => user);
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([MOCK_CASE]);
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue(mockJudge);
  });

  it('throws an exception when the user is unauthorized', async () => {
    user = new User({
      name: PARTY_TYPES.petitioner,
      role: ROLES.petitioner,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    await expect(
      getCalendaredCasesForTrialSessionInteractor(applicationContext, {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).rejects.toThrowError(UnauthorizedError);
  });

  it('should find the cases for a trial session successfully', async () => {
    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    await expect(
      getCalendaredCasesForTrialSessionInteractor(applicationContext, {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).resolves.not.toThrow();
  });
});
