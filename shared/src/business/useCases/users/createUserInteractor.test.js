const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  UnauthorizedError,
} = require('../../../../../shared/src/errors/errors');
const { createUserInteractor } = require('./createUserInteractor');
const { ROLES } = require('../../entities/EntityConstants');

describe('create user', () => {
  it('creates the user', async () => {
    const mockUser = {
      name: 'Test PetitionsClerk',
      role: ROLES.petitionsClerk,
      userId: '615b7d39-8fae-4c2f-893c-3c829598bc71',
    };

    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Admin',
      role: ROLES.admin,
      userId: 'ad3b7d39-8fae-4c2f-893c-3c829598bc71',
    });
    applicationContext
      .getPersistenceGateway()
      .createUser.mockReturnValue(mockUser);

    const userToCreate = {
      barNumber: '',
      name: 'Jesse Pinkman',
      role: ROLES.petitionsClerk,
      userId: '245b7d39-8fae-4c2f-893c-3c829598bc71',
    };
    const user = await createUserInteractor({
      applicationContext,
      user: userToCreate,
    });
    expect(user).not.toBeUndefined();
  });

  it('throws unauthorized for any user without an "admin" role', async () => {
    const mockUser = {
      name: 'Test Petitioner',
      role: ROLES.petitioner,
      userId: '245b7d39-8fae-4c2f-893c-3c829598bc71',
    };
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Admin',
      role: ROLES.petitioner,
      userId: 'ad2b7d39-8fae-4c2f-893c-3c829598bc71',
    });
    applicationContext
      .getPersistenceGateway()
      .createUser.mockReturnValue(mockUser);
    const userToCreate = { userId: '145b7d39-8fae-4c2f-893c-3c829598bc71' };

    await expect(
      createUserInteractor({
        applicationContext,
        user: userToCreate,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should create a practitioner user when the user role is privatePractitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Admin',
      role: ROLES.admin,
      userId: 'ad5b7d39-8fae-4c2f-893c-3c829598bc71',
    });
    applicationContext.getPersistenceGateway().createUser.mockReturnValue({
      barNumber: 'CS20001',
      name: 'Test PrivatePractitioner',
      role: ROLES.privatePractitioner,
      userId: '745b7d39-8fae-4c2f-893c-3c829598bc71',
    });

    const userToCreate = {
      admissionsDate: '2020-03-14',
      admissionsStatus: 'Active',
      birthYear: '1993',
      employer: 'Private',
      firstName: 'Test',
      lastName: 'PrivatePractitioner',
      originalBarState: 'CA',
      practitionerType: 'Attorney',
      role: ROLES.privatePractitioner,
    };

    const user = await createUserInteractor({
      applicationContext,
      user: userToCreate,
    });

    expect(user).toMatchObject({
      barNumber: 'CS20001',
      role: ROLES.privatePractitioner,
    });
  });

  it('should create a practitioner user when the user role is irsPractitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admin,
      userId: 'admin',
    });
    applicationContext.getPersistenceGateway().createUser.mockReturnValue({
      barNumber: 'CS20001',
      name: 'Test PrivatePractitioner',
      role: ROLES.irsPractitioner,
      userId: '745b7d39-8fae-4c2f-893c-3c829598bc71',
    });
    const mockAdmissionsDate = '1876-02-19';

    const user = await createUserInteractor({
      applicationContext,
      user: {
        admissionsDate: mockAdmissionsDate,
        admissionsStatus: 'Active',
        birthYear: '1993',
        employer: 'DOJ',
        firstName: 'Test',
        lastName: 'IRSPractitioner',
        originalBarState: 'CA',
        practitionerType: 'Attorney',
        role: ROLES.irsPractitioner,
      },
    });

    expect(user).toMatchObject({
      barNumber: 'CS20001',
      role: ROLES.irsPractitioner,
    });
  });

  it('should create a practitioner user when the user role is inactivePractitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admin,
      userId: 'admin',
    });
    applicationContext.getPersistenceGateway().createUser.mockReturnValue({
      barNumber: 'CS20001',
      name: 'Test InactivePractitioner',
      role: ROLES.inactivePractitioner,
      userId: '745b7d39-8fae-4c2f-893c-3c829598bc71',
    });
    const mockAdmissionsDate = '1876-02-19';

    const user = await createUserInteractor({
      applicationContext,
      user: {
        admissionsDate: mockAdmissionsDate,
        admissionsStatus: 'Inactive',
        birthYear: '1993',
        employer: 'DOJ',
        firstName: 'Test',
        lastName: 'IRSPractitioner',
        originalBarState: 'CA',
        practitionerType: 'Attorney',
        role: ROLES.inactivePractitioner,
      },
    });

    expect(user).toMatchObject({
      barNumber: 'CS20001',
      role: ROLES.inactivePractitioner,
    });
  });

  it('creates a legacyJudge user', async () => {
    const mockUser = {
      name: 'Test Legacy Judge',
      role: ROLES.legacyJudge,
      userId: '845b7d39-8fae-4c2f-893c-3c829598bc71',
    };
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Admin',
      role: ROLES.admin,
      userId: 'admin',
    });

    applicationContext
      .getPersistenceGateway()
      .createUser.mockReturnValue(mockUser);

    const userToCreate = {
      barNumber: '',
      name: 'Jesse Pinkman',
      role: ROLES.legacyJudge,
      userId: 'legacyJudge1@example.com',
    };

    const user = await createUserInteractor({
      applicationContext,
      user: userToCreate,
    });

    expect(user).not.toBeUndefined();
    expect(
      applicationContext.getPersistenceGateway().createUser,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        disableCognitoUser: true,
      }),
    );
  });
});
