import { Role } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';

export async function updateUser(
  applicationContext: ServerApplicationContext,
  {
    email,
    role,
    userPoolId,
  }: { email: string; role: Role; userPoolId?: string },
): Promise<string> {
  const response = await applicationContext.getCognito().adminGetUser({
    UserPoolId: userPoolId || process.env.USER_POOL_ID,
    Username: email,
  });

  await applicationContext.getCognito().adminUpdateUserAttributes({
    UserAttributes: [
      {
        Name: 'custom:role',
        Value: role,
      },
    ],
    UserPoolId: userPoolId || process.env.USER_POOL_ID,
    Username: response.Username,
  });

  const userId = response.Username;

  if (!userId) {
    throw new Error(`Unable to update user for email ${email}`);
  }

  return userId;
}
