import { Role } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';

export async function createUser(
  applicationContext: ServerApplicationContext,
  {
    email,
    name,
    password,
    role,
    userPoolId,
  }: {
    email: string;
    userPoolId?: string;
    name: string;
    role: Role;
    password: string;
  },
): Promise<string> {
  const response = await applicationContext.getCognito().adminCreateUser({
    DesiredDeliveryMediums: ['EMAIL'],
    MessageAction: 'SUPPRESS',
    TemporaryPassword: password,
    UserAttributes: [
      {
        Name: 'email_verified',
        Value: 'True',
      },
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'custom:role',
        Value: role,
      },
      {
        Name: 'name',
        Value: name,
      },
    ],
    UserPoolId: userPoolId || process.env.USER_POOL_ID,
    Username: email,
  });

  // replace sub here
  const userId = response.User!.Username;

  if (!userId) {
    throw new Error(`Unable to create user for email ${email}`);
  }

  return userId;
}
