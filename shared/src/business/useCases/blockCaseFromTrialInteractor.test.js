const {
  blockCaseFromTrialInteractor,
} = require('./blockCaseFromTrialInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

describe('blockCaseFromTrialInteractor', () => {
  let user;

  beforeEach(() => {
    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockImplementation(() => user);
  });

  it('should update the case with the blocked flag set as true and attach a reason', async () => {
    user = {
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockResolvedValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(({ caseToUpdate }) => caseToUpdate);

    const result = await blockCaseFromTrialInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      reason: 'just because',
    });

    expect(result).toMatchObject({
      blocked: true,
      blockedReason: 'just because',
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords.mock.calls[0][0].caseId,
    ).toEqual(MOCK_CASE.caseId);
  });

  it('should throw an unauthorized error if the user has no access to block cases', async () => {
    user = {
      role: 'nope',
      userId: 'nope',
    };

    await expect(
      blockCaseFromTrialInteractor({
        applicationContext,
        caseId: '123',
      }),
    ).rejects.toThrow('Unauthorized');
  });
});
