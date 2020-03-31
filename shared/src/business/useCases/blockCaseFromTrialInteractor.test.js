const {
  blockCaseFromTrialInteractor,
} = require('./blockCaseFromTrialInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

describe('blockCaseFromTrialInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(({ caseToUpdate }) => caseToUpdate);
  });

  it('should update the case with the blocked flag set as true and attach a reason', async () => {
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
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'nope',
      userId: 'nope',
    });

    let error;
    try {
      await blockCaseFromTrialInteractor({
        applicationContext,
        caseId: '123',
      }),
    ).rejects.toThrow('Unauthorized');
  });
});
