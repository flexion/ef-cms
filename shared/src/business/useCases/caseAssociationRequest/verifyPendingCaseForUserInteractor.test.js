const {
  verifyPendingCaseForUserInteractor,
} = require('./verifyPendingCaseForUserInteractor');
const { User } = require('../../entities/User');

describe('verifyPendingCaseForUser', () => {
  let applicationContext;

  let caseRecord = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    docketNumber: '123-19',
  };

  it('should return results retrieved from persistence', async () => {
    let verifyPendingCaseForUserSpy = jest.fn().mockReturnValue(true);

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          name: 'Olivia Jade',
          role: User.ROLES.privatePractitioner,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        };
      },
      getPersistenceGateway: () => ({
        verifyPendingCaseForUser: verifyPendingCaseForUserSpy,
      }),
    };

    await verifyPendingCaseForUserInteractor({
      applicationContext,
      caseId: caseRecord.caseId,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(verifyPendingCaseForUserSpy).toBeCalled();
  });
});
