import { ServerApplicationContext } from '@web-api/applicationContext';

export const isEmailAvailable = async (
  applicationContext: ServerApplicationContext,
  { email }: { email: string },
): Promise<boolean> => {
  const userExists = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, {
      email,
    });

  return !userExists;
};
