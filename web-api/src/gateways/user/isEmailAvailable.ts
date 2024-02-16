import { ServerApplicationContext } from '@web-api/applicationContext';

export const isEmailAvailable = async (
  applicationContext: ServerApplicationContext,
  { email, userPoolId }: { email: string; userPoolId?: string },
): Promise<boolean> => {
  const userExists = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, {
      email,
      userPoolId,
    });

  return !userExists;
};
