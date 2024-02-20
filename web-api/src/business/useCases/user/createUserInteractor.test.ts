import {
  PETITIONS_SECTION,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createUserInteractor } from './createUserInteractor';

describe('createUserInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Admin',
      role: ROLES.admin,
      userId: 'ef11dfdc-a4f3-48c9-b8b1-c4c959ae122c',
    });
  });

  it('should throw an error when the user is not authorized to create users', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Not Authorized',
      role: ROLES.petitioner,
      userId: 'ad2b7d39-8fae-4c2f-893c-3c829598bc71',
    });
    applicationContext
      .getPersistenceGateway()
      .createOrUpdateUser.mockReturnValue({
        name: 'Test Petitioner',
        role: ROLES.petitioner,
        userId: '245b7d39-8fae-4c2f-893c-3c829598bc71',
      });

    await expect(
      createUserInteractor(applicationContext, {
        user: { userId: '145b7d39-8fae-4c2f-893c-3c829598bc71' },
      } as any),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should create a practitioner user when the user role is privatePractitioner', async () => {
    applicationContext.getPersistenceGateway().createUser.mockReturnValue({
      barNumber: 'CS20001',
      name: 'Test PrivatePractitioner',
      role: ROLES.privatePractitioner,
      userId: '745b7d39-8fae-4c2f-893c-3c829598bc71',
    });

    const user = await createUserInteractor(applicationContext, {
      user: {
        admissionsDate: '2020-03-14',
        admissionsStatus: 'Active',
        birthYear: '1993',
        employer: 'Private',
        firstName: 'Test',
        lastName: 'PrivatePractitioner',
        originalBarState: 'CA',
        practitionerType: 'Attorney',
        role: ROLES.privatePractitioner,
      },
    } as any);

    expect(user).toMatchObject({
      barNumber: 'CS20001',
      role: ROLES.privatePractitioner,
    });
  });

  it('should create a practitioner user when the user role is irsPractitioner', async () => {
    applicationContext
      .getPersistenceGateway()
      .createOrUpdateUser.mockReturnValue({
        barNumber: 'CS20001',
        name: 'Test PrivatePractitioner',
        role: ROLES.irsPractitioner,
        userId: '745b7d39-8fae-4c2f-893c-3c829598bc71',
      });

    const user = await createUserInteractor(applicationContext, {
      user: {
        admissionsDate: '1876-02-19',
        admissionsStatus: 'Active',
        birthYear: '1993',
        employer: 'DOJ',
        firstName: 'Test',
        lastName: 'IRSPractitioner',
        originalBarState: 'CA',
        practitionerType: 'Attorney',
        role: ROLES.irsPractitioner,
      } as any,
    });

    expect(user).toMatchObject({
      barNumber: 'CS20001',
      role: ROLES.irsPractitioner,
    });
  });

  it('should create an inactive practitioner user when the user role is inactivePractitioner', async () => {
    applicationContext
      .getPersistenceGateway()
      .createOrUpdateUser.mockReturnValue({
        barNumber: 'CS20001',
        name: 'Test InactivePractitioner',
        role: ROLES.inactivePractitioner,
        userId: '745b7d39-8fae-4c2f-893c-3c829598bc71',
      });

    const user = await createUserInteractor(applicationContext, {
      user: {
        admissionsDate: '1876-02-19',
        admissionsStatus: 'Inactive',
        birthYear: '1993',
        employer: 'DOJ',
        firstName: 'Test',
        lastName: 'IRSPractitioner',
        originalBarState: 'CA',
        practitionerType: 'Attorney',
        role: ROLES.inactivePractitioner,
      } as any,
    });

    expect(user).toMatchObject({
      barNumber: 'CS20001',
      role: ROLES.inactivePractitioner,
    });
  });

  it('should create a user without a barNumber when it is provided but the user is NOT a practitioner', async () => {
    const mockNewPetitionsClerk = {
      barNumber: 'NOT_PERSISTED',
      email: 'testpetitionsclerk@example.com',
      name: 'Test Petitions Clerk',
      password: 'Testing1234$',
      role: ROLES.petitionsClerk,
      section: PETITIONS_SECTION,
    };
    applicationContext
      .getPersistenceGateway()
      .createOrUpdateUser.mockReturnValue({
        name: 'Petitions Clerk',
        role: ROLES.petitionsClerk,
        userId: '745b7d39-8fae-4c2f-893c-3c829598bc71',
      });

    await createUserInteractor(applicationContext, {
      user: mockNewPetitionsClerk,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().createOrUpdateUser.mock
        .calls[0][1],
    ).toMatchObject({
      password: mockNewPetitionsClerk.password,
      user: {
        email: mockNewPetitionsClerk.email,
        entityName: 'User',
        name: mockNewPetitionsClerk.name,
        role: mockNewPetitionsClerk.role,
      },
    });
    expect(
      applicationContext.getPersistenceGateway().createOrUpdateUser.mock
        .calls[0][1].user.barNumber,
    ).toBeUndefined();
  });

  it('should disable the user`s account upon creation when their role is "legacyJudge"', async () => {
    applicationContext
      .getPersistenceGateway()
      .createOrUpdateUser.mockReturnValue({
        name: 'Test Legacy Judge',
        role: ROLES.legacyJudge,
        userId: '845b7d39-8fae-4c2f-893c-3c829598bc71',
      });

    const user = await createUserInteractor(applicationContext, {
      user: {
        barNumber: '',
        name: 'Jesse Pinkman',
        role: ROLES.legacyJudge,
        userId: 'legacyJudge1@example.com',
      },
    } as any);

    expect(user).not.toBeUndefined();
    expect(applicationContext.getUserGateway().disableUser).toHaveBeenCalled();
  });
});
