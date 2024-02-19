import {
  MOCK_PRACTITIONER,
  admissionsClerkUser,
  petitionerUser,
} from '../../../../../shared/src/test/mockUsers';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { SERVICE_INDICATOR_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateChangeOfAddress } from '../../../../../shared/src/business/useCases/users/generateChangeOfAddress';
import { updatePractitionerUserInteractor } from './updatePractitionerUserInteractor';
jest.mock(
  '../../../../../shared/src/business/useCases/users/generateChangeOfAddress',
);

describe('updatePractitionerUserInteractor', () => {
  let testUser;
  let mockPractitioner = MOCK_PRACTITIONER;

  beforeEach(() => {
    testUser = admissionsClerkUser;
    mockPractitioner = { ...MOCK_PRACTITIONER };

    applicationContext.getCurrentUser.mockImplementation(() => testUser);
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockImplementation(() => mockPractitioner);
    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue(['123-23']);
    applicationContext
      .getPersistenceGateway()
      .createNewPractitionerUser.mockImplementation(({ user }) => user);
    applicationContext
      .getPersistenceGateway()
      .updatePractitionerUser.mockImplementation(({ user }) => user);
    applicationContext.getUserGateway().isEmailAvailable.mockReturnValue(true);
  });

  it('should throw an unauthorized error when the user does not have permission to update the practitioner user', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    await expect(
      updatePractitionerUserInteractor(applicationContext, {
        barNumber: 'pt101',
        user: mockPractitioner,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw an error when the bar number provided does not match a user in the database', async () => {
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockResolvedValue(undefined);

    await expect(
      updatePractitionerUserInteractor(applicationContext, {
        barNumber: 'AB1111',
        bypassDocketEntry: false,
        user: {
          ...mockPractitioner,
          barNumber: 'AB1111',
          updatedEmail: 'bc@example.com',
          userId: '9ea9732c-9751-4159-9619-bd27556eb9bc',
        },
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw an error when the bar number/userId provided does not match a user in the database', async () => {
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockResolvedValue({
        ...mockPractitioner,
        userId: '2c14ebbc-a6e1-4267-b6b7-e329e592ec93',
      });

    await expect(
      updatePractitionerUserInteractor(applicationContext, {
        barNumber: 'AB1111',
        bypassDocketEntry: false,
        user: mockPractitioner,
      }),
    ).rejects.toThrow('Bar number does not match user data.');
  });

  it("should not set the practitioner's serviceIndicator to electronic when an email is added", async () => {
    mockPractitioner = {
      ...mockPractitioner,
      email: undefined,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    await updatePractitionerUserInteractor(applicationContext, {
      barNumber: 'AB1111',
      user: {
        ...mockPractitioner,
        confirmEmail: 'bc@example.com',
        updatedEmail: 'bc@example.com',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().createNewPractitionerUser.mock
        .calls[0][0].user.serviceIndicator,
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_PAPER);
  });

  it('should update the practitioner user and NOT override their bar number or email when the original user had an email', async () => {
    await updatePractitionerUserInteractor(applicationContext, {
      barNumber: 'AB1111',
      user: {
        ...mockPractitioner,
        barNumber: 'AB2222',
        confirmEmail: 'bc@example.com',
        updatedEmail: 'bc@example.com',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updatePractitionerUser,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updatePractitionerUser.mock
        .calls[0][0],
    ).toMatchObject({ user: mockPractitioner });
  });

  it('should update the practitioner user and NOT override their bar number when the original user has a pending email', async () => {
    mockPractitioner.email = undefined;
    mockPractitioner.pendingEmail = 'pendingEmail@example.com';

    await updatePractitionerUserInteractor(applicationContext, {
      barNumber: 'AB1111',
      user: {
        ...mockPractitioner,
        barNumber: 'AB2222',
        confirmEmail: 'bc@example.com',
        updatedEmail: 'bc@example.com',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updatePractitionerUser,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updatePractitionerUser.mock
        .calls[0][0],
    ).toMatchObject({ user: mockPractitioner });
  });

  it('should create and update the practitioner user and adds a pending email when the original user did not have an email', async () => {
    const mockPractitionerEmail = 'lawyer7@example.com';
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockResolvedValue({
        ...mockPractitioner,
        email: undefined,
      });

    await updatePractitionerUserInteractor(applicationContext, {
      barNumber: 'AB1111',
      user: {
        ...mockPractitioner,
        confirmEmail: mockPractitionerEmail,
        updatedEmail: mockPractitionerEmail,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().createNewPractitionerUser,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().createNewPractitionerUser.mock
        .calls[0][0].user.pendingEmail,
    ).toEqual(mockPractitionerEmail);
  });

  it('should update practitioner information when the practitioner does not have an email and is not updating their email', async () => {
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockResolvedValue({
        ...mockPractitioner,
        email: undefined,
      });

    await updatePractitionerUserInteractor(applicationContext, {
      barNumber: 'AB1111',
      user: {
        ...mockPractitioner,
        email: undefined,
        firstName: 'Donna',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateUserRecords.mock
        .calls[0][0],
    ).toMatchObject({
      updatedUser: {
        ...mockPractitioner,
        email: undefined,
        firstName: 'Donna',
        name: 'Donna Attorney',
      },
    });
  });

  describe('updating email', () => {
    it('should throw an error when the logged in user does not have permission to manage emails', async () => {
      applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

      await expect(
        updatePractitionerUserInteractor(applicationContext, {
          barNumber: mockPractitioner.barNumber,
          user: mockPractitioner,
        }),
      ).rejects.toThrow('Unauthorized for updating practitioner user');
    });

    it('should throw an error when the provided email is already associated with an account', async () => {
      applicationContext
        .getUserGateway()
        .isEmailAvailable.mockResolvedValue(false);

      await expect(
        updatePractitionerUserInteractor(applicationContext, {
          barNumber: mockPractitioner.barNumber,
          user: {
            ...mockPractitioner,
            confirmEmail: 'exists@example.com',
            updatedEmail: 'exists@example.com',
          },
        }),
      ).rejects.toThrow('Email is not available');
    });

    it('should update the user`s email when the updated email is valid and NOT already associated with an account', async () => {
      const mockUpdatedEmail = 'free-email-to-use@example.com';

      await updatePractitionerUserInteractor(applicationContext, {
        barNumber: mockPractitioner.barNumber,
        user: {
          ...mockPractitioner,
          confirmEmail: mockUpdatedEmail,
          updatedEmail: mockUpdatedEmail,
        },
      });

      expect(
        applicationContext.getPersistenceGateway().updatePractitionerUser.mock
          .calls[0][0].user,
      ).toMatchObject({
        pendingEmail: mockUpdatedEmail,
        pendingEmailVerificationToken: expect.anything(),
      });
    });

    it('should send a verification email to the user when they change their email', async () => {
      const mockUpdatedEmail = 'free-email-to-use@example.com';

      await updatePractitionerUserInteractor(applicationContext, {
        barNumber: mockPractitioner.barNumber,
        user: {
          ...mockPractitioner,
          confirmEmail: mockUpdatedEmail,
          updatedEmail: mockUpdatedEmail,
        },
      });

      expect(
        applicationContext.getUseCaseHelpers().sendEmailVerificationLink.mock
          .calls[0][0],
      ).toMatchObject({
        pendingEmail: mockUpdatedEmail,
        pendingEmailVerificationToken: expect.anything(),
      });
    });

    it("should NOT send a verification email to the user when the user's email is being added for the first time", async () => {
      const mockEmail = 'free-email-to-use@example.com';
      mockPractitioner.email = undefined;

      await updatePractitionerUserInteractor(applicationContext, {
        barNumber: mockPractitioner.barNumber,
        user: {
          ...mockPractitioner,
          confirmEmail: mockEmail,
          updatedEmail: mockEmail,
        },
      });

      expect(
        applicationContext.getUseCaseHelpers().sendEmailVerificationLink,
      ).not.toHaveBeenCalled();
    });

    it('should NOT generate a change of address PDF when ONLY the practitioner`s email is being updated', async () => {
      const mockUpdatedEmail = 'free-email-to-use@example.com';

      await updatePractitionerUserInteractor(applicationContext, {
        barNumber: mockPractitioner.barNumber,
        user: {
          ...mockPractitioner,
          confirmEmail: mockUpdatedEmail,
          updatedEmail: mockUpdatedEmail,
        },
      });

      expect(generateChangeOfAddress).not.toHaveBeenCalled();
    });

    it('should NOT generate a change of address PDF when ONLY their account notes are being updated', async () => {
      await updatePractitionerUserInteractor(applicationContext, {
        barNumber: mockPractitioner.barNumber,
        user: {
          ...mockPractitioner,
          practitionerNotes: 'wow, real good notes',
        },
      });

      expect(generateChangeOfAddress).not.toHaveBeenCalled();
    });

    it('should NOT generate a change of address PDF when ONLY the practitioner`s notes and email are being updated', async () => {
      const mockUpdatedEmail = 'free-email-to-use@example.com';

      await updatePractitionerUserInteractor(applicationContext, {
        barNumber: mockPractitioner.barNumber,
        user: {
          ...mockPractitioner,
          confirmEmail: mockUpdatedEmail,
          practitionerNotes: 'wow, real good notes',
          updatedEmail: mockUpdatedEmail,
        },
      });

      expect(generateChangeOfAddress).not.toHaveBeenCalled();
    });

    it('should generate a change of address PDF when the practitioner`s email is being updated along with their street address', async () => {
      const mockUpdatedEmail = 'free-email-to-use@example.com';

      await updatePractitionerUserInteractor(applicationContext, {
        barNumber: mockPractitioner.barNumber,
        user: {
          ...mockPractitioner,
          confirmEmail: mockUpdatedEmail,
          contact: {
            ...mockPractitioner.contact!,
            address1: '1235 Updated Address Avenue',
          },
          updatedEmail: mockUpdatedEmail,
        },
      });

      expect(generateChangeOfAddress).toHaveBeenCalled();
    });

    it('should generate a change of address PDF when the practitioner`s email is being updated along with their name', async () => {
      const mockUpdatedEmail = 'free-email-to-use@example.com';

      await updatePractitionerUserInteractor(applicationContext, {
        barNumber: mockPractitioner.barNumber,
        user: {
          ...mockPractitioner,
          confirmEmail: mockUpdatedEmail,
          firstName: 'Helen',
          lastName: 'Hunt',
          updatedEmail: mockUpdatedEmail,
        },
      });

      expect(generateChangeOfAddress).toHaveBeenCalled();
    });
  });
});
