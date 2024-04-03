import {
  AdminGetUserCommandOutput,
  AdminInitiateAuthCommandOutput,
  AttributeType,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';

// TODO Handle Post Migration, Set Flag? Or Delete User?
export const handler = async (event, context) => {
  const applicationContext: ServerApplicationContext = createApplicationContext(
    {},
  );

  if (event.triggerSource == 'UserMigration_Authentication') {
    // authenticate the user with old user pool
    const result: AdminInitiateAuthCommandOutput = await applicationContext
      .getCognito()
      .adminInitiateAuth({
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        AuthParameters: {
          PASSWORD: event.request.password,
          USERNAME: event.userName,
        },
        ClientId: '2em8dvalgn7eednvasqa6reok3', // OLD user pool
        UserPoolId: 'us-east-1_jDerGoxYK', // OLD user pool
      });

    let user: AdminGetUserCommandOutput;
    if (result.hasOwnProperty('AuthenticationResult')) {
      user = await applicationContext.getCognito().adminGetUser({
        UserPoolId: 'us-east-1_jDerGoxYK', // OLD user pool
        Username: event.userName,
      });
    } else {
      return;
    }

    let userAttributes: AttributeType[] = [];
    let sub, customUserId;

    if (user.Username) {
      user.UserAttributes?.forEach(attribute => {
        if (attribute.Name == 'sub') {
          sub = attribute.Value;
          return;
        }
        if (attribute.Name === 'custom:userId') {
          customUserId = attribute.Value;
          return;
        }
        userAttributes.push(attribute);
      });

      // Create user in new user pool
      const createUserResult = await applicationContext
        .getCognito()
        .adminCreateUser({
          TemporaryPassword: event.request.password,
          UserAttributes: [
            ...userAttributes,
            {
              Name: 'custom:userId',
              Value: customUserId || sub,
            },
            {
              Name: 'email_verified',
              Value: 'True',
            },
          ],
          UserPoolId: 'us-east-1_cH7eMtBTZ', // NEW user pool id
          Username: event.userName,
        });

      if (createUserResult?.User?.UserStatus == 'FORCE_CHANGE_PASSWORD') {
        await applicationContext.getCognito().adminSetUserPassword({
          Password: event.request.password,
          Permanent: true,
          UserPoolId: 'us-east-1_cH7eMtBTZ', // NEW user pool id
          Username: createUserResult.User.Username,
        });
      }

      // Allow user to login
      event.response.userAttributes = userAttributes;
      event.response.finalUserStatus = 'CONFIRMED';
      event.response.messageAction = 'SUPPRESS';
      context.succeed(event);
    }
  } else if (event.triggerSource == 'UserMigration_ForgotPassword') {
    console.log('Forgot Password - UserMigration_ForgotPassword', event);

    // Get user from old user pool
    const { Users: existingAccounts } = await cognito.listUsers({
      Filter: `email = "${user.email}"`,
      UserPoolId: 'us-east-1_jDerGoxYK',
    });
    console.log('user', user);

    if (user.Username) {
      // user found
      // create user in new user pool in "force password change"
      // send password change email
      // return message that code has been sent

      let userAttributes = {};

      user.UserAttributes?.forEach(attribute => {
        if (attribute.Name == 'sub') {
          return;
        }
        userAttributes[attribute.Name!] = attribute.Value;
      });

      //***Note:*** email_verified or phone_number_verified must be set to true
      //to enable password-reset code to be sent to user
      //If the attribute is not already set in the source user pool,
      //uncomment the following line as an example to set email as verified

      //userAttributes['email_verified'] = "true";

      event.response.userAttributes = userAttributes;

      event.response.messageAction = 'SUPPRESS';
      context.succeed(event);
    }
  } else {
    // return message that code has been sent even if user not found
    // Return error to Amazon Cognito
    console.log('Bad triggerSource');
  }
};
