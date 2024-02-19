import { AdminUpdateUserAttributesCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { ServerApplicationContext } from '@web-api/applicationContext';

export async function confirmSignUp(
  applicationContext: ServerApplicationContext,
  { email }: { email: string },
): Promise<AdminUpdateUserAttributesCommandOutput> {
  await applicationContext.getCognito().adminConfirmSignUp({
    UserPoolId: process.env.USER_POOL_ID,
    Username: email,
  });

  return applicationContext.getCognito().adminUpdateUserAttributes({
    UserAttributes: [
      {
        Name: 'email_verified',
        Value: 'true',
      },
      {
        Name: 'email',
        Value: email,
      },
    ],
    UserPoolId: process.env.USER_POOL_ID,
    Username: email, // Per cognito docs, can be sub OR email (because it is defined as username_attributes)
  });
}
