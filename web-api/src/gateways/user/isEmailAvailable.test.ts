import { ROLES } from '@shared/business/entities/EntityConstants';
import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { isEmailAvailable } from './isEmailAvailable';

describe('isEmailAvailable', () => {
  it('should return false when there is a corresponding user with the provided email found in the databse', async () => {
    const mockEmail = 'test@example.com';

    applicationContext.getUserGateway().getUserByEmail.mockResolvedValue({
      accountStatus: UserStatusType.CONFIRMED,
      email: mockEmail,
      name: 'Test Petitioner',
      role: ROLES.petitioner,
      userId: 'c17328d3-0f1c-462a-9974-cf95935407f6',
    });

    await expect(
      isEmailAvailable(applicationContext, {
        email: mockEmail,
      }),
    ).resolves.toEqual(false);
  });

  it('should return true when there is no corresponding user with the provided email found in the database', async () => {
    const mockEmail = 'test@example.com';
    applicationContext
      .getUserGateway()
      .getUserByEmail.mockResolvedValue(undefined);

    await expect(
      isEmailAvailable(applicationContext, {
        email: mockEmail,
      }),
    ).resolves.toEqual(true);
  });
});
