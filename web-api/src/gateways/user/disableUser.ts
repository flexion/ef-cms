import { ROLES, Role } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';

export async function disableUser(
  applicationContext: ServerApplicationContext,
  {
    role,
    userId,
  }: {
    userId: string;
    role: Role;
  },
) {
  let userPoolId =
    role === ROLES.irsSuperuser
      ? process.env.USER_POOL_IRS_ID
      : process.env.USER_POOL_ID;

  await applicationContext.getCognito().adminDisableUser({
    UserPoolId: userPoolId,
    Username: userId,
  });
}
