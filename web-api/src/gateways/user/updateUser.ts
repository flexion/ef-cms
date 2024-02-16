import { ROLES, Role } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';

export async function updateUser(
  applicationContext: ServerApplicationContext,
  { email, role }: { email: string; role: Role },
): Promise<string> {
  let userPoolId =
    role === ROLES.irsSuperuser
      ? process.env.USER_POOL_IRS_ID
      : process.env.USER_POOL_ID;

  const response = await applicationContext.getCognito().adminGetUser({
    UserPoolId: userPoolId,
    Username: email,
  });

  await applicationContext.getCognito().adminUpdateUserAttributes({
    UserAttributes: [
      {
        Name: 'custom:role',
        Value: role,
      },
    ],
    UserPoolId: userPoolId,
    Username: response.Username, // and here
  });

  const userId = response.Username;

  if (!userId) {
    throw new Error(`Unable to update user for email ${email}`);
  }

  //and here
  return userId;
}
