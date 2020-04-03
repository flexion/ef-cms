const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getPractitionerByBarNumberInteractor,
} = require('./getPractitionerByBarNumberInteractor');
const { User } = require('../../entities/User');

describe('getPractitionerByBarNumberInteractor', () => {
  it('throws an unauthrized error if the request user does not have the MANAGE_ATTORNEY_USERS permissions', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Test Petitioner',
        role: User.ROLES.petitioner,
        userId: '1005d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    await expect(
      getPractitionerByBarNumberInteractor({
        applicationContext,
        barNumber: 'BN0000',
      }),
    ).rejects.toThrow('Unauthorized for getting attorney user');
  });

  it('calls the persistence method to get a private practitioner with the given bar number', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Test Petitionsclerk',
        role: User.ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockReturnValue({
        admissionsDate: '2019-03-01T21:42:29.073Z',
        admissionsStatus: 'Active',
        barNumber: 'PP1234',
        birthYear: '1983',
        employer: 'Private',
        isAdmitted: true,
        name: 'Private Practitioner',
        practitionerType: 'Attorney',
        role: User.ROLES.privatePractitioner,
        section: 'privatePractitioner',
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });

    let error;
    let practitioner;

    try {
      practitioner = await getPractitionerByBarNumberInteractor({
        applicationContext,
        barNumber: 'PP1234',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(practitioner).toEqual({
      admissionsDate: '2019-03-01T21:42:29.073Z',
      admissionsStatus: 'Active',
      barNumber: 'PP1234',
      birthYear: '1983',
      employer: 'Private',
      isAdmitted: true,
      name: 'Private Practitioner',
      practitionerType: 'Attorney',
      role: User.ROLES.privatePractitioner,
      section: 'privatePractitioner',
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });

  it('calls the persistence method to get a private practitioner with the given bar number', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Test Petitionsclerk',
        role: User.ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockReturnValue({
        admissionsDate: '2019-03-01T21:42:29.073Z',
        admissionsStatus: 'Active',
        barNumber: 'PI5678',
        birthYear: '1983',
        employer: 'Private',
        isAdmitted: true,
        name: 'IRS Practitioner',
        practitionerType: 'Attorney',
        role: User.ROLES.irsPractitioner,
        section: 'privatePractitioner',
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });

    let error;
    let practitioner;

    try {
      practitioner = await getPractitionerByBarNumberInteractor({
        applicationContext,
        barNumber: 'PI5678',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(practitioner).toEqual({
      admissionsDate: '2019-03-01T21:42:29.073Z',
      admissionsStatus: 'Active',
      barNumber: 'PI5678',
      birthYear: '1983',
      employer: 'Private',
      isAdmitted: true,
      name: 'IRS Practitioner',
      practitionerType: 'Attorney',
      role: User.ROLES.irsPractitioner,
      section: 'privatePractitioner',
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });

  it('throws a not found error if no pracititoner is found with the given bar number', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Test Petitionsclerk',
        role: User.ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockReturnValue(undefined);

    await expect(
      getPractitionerByBarNumberInteractor({
        applicationContext,
        barNumber: 'BN0000',
      }),
    ).rejects.toThrow('No practitioner with the given bar number was found');
  });
});
