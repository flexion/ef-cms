import { applicationContext } from '../../test/createTestApplicationContext';
import { checkEmailAvailabilityInteractor } from './checkEmailAvailabilityInteractor';
import {
  petitionsClerkUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';

describe('checkEmailAvailabilityInteractor', () => {
  const mockEmail = 'test@example.com';

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(privatePractitionerUser);
  });

  it('should throw an error when the logged in user is unauthorized to check email availability', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    await expect(
      checkEmailAvailabilityInteractor(applicationContext, {
        email: mockEmail,
      }),
    ).rejects.toThrow('Unauthorized to manage emails.');
  });

  it('should return true when the provided email is not already in use', async () => {
    applicationContext
      .getUserGateway()
      .isEmailAvailable.mockResolvedValue(true);

    const result = await checkEmailAvailabilityInteractor(applicationContext, {
      email: mockEmail,
    });

    expect(result).toEqual(true);
  });

  it('should return false when the provided email is already in use', async () => {
    applicationContext
      .getUserGateway()
      .isEmailAvailable.mockResolvedValue(false);

    const result = await checkEmailAvailabilityInteractor(applicationContext, {
      email: mockEmail,
    });

    expect(result).toEqual(false);
  });
});
