import {
  AdminCreateUserCommandInput,
  AttributeType,
  AuthFlowType,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';

export const handler = async event => {
  const applicationContext: ServerApplicationContext = createApplicationContext(
    {},
  );

  if (event.triggerSource == 'UserMigration_Authentication') {
    // authenticate the user with old user pool
    const result = await applicationContext.getCognito().adminInitiateAuth({
      AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
      AuthParameters: {
        PASSWORD: event.request.password,
        USERNAME: event.userName,
      },
      ClientId: '2em8dvalgn7eednvasqa6reok3', // OLD user pool
      UserPoolId: 'us-east-1_jDerGoxYK', // OLD user pool
    });

    let user;
    if (result.hasOwnProperty('AuthenticationResult')) {
      user = await applicationContext.getCognito().adminGetUser({
        UserPoolId: 'us-east-1_jDerGoxYK', // OLD user pool
        Username: event.userName,
      });
    }

    let userAttributes: AttributeType[] = [];
    let sub,
      customUserId = '';

    if (user.Username) {
      user.UserAttributes.forEach(attribute => {
        if (attribute.Name == 'sub') {
          sub = attribute.Value;
          return;
        }
        if (attribute.Name === 'custom:userId') {
          customUserId = attribute.Value;
          return;
        }
        userAttributes[attribute.Name] = attribute.Value;
      });

      if (customUserId === '') {
        customUserId = sub;
      }

      // Create user in new user pool
      await applicationContext.getCognito().adminCreateUser({
        DesiredDeliveryMediums: ['EMAIL'],
        TemporaryPassword: event.request.password,
        UserAttributes: [
          ...userAttributes,
          {
            Name: 'custom:userId',
            Value: customUserId,
          },
          // {
          //   Name: 'email_verified',
          //   Value: 'True',
          // },
        ],
        UserPoolId: process.env.USER_POOL_ID!,
        Username: user.pendingEmail!,
      });

      // Allow user to login
      //   event.response.userAttributes = userAttributes;
      //   event.response.finalUserStatus = 'CONFIRMED';
      //   event.response.messageAction = 'SUPPRESS';
      //   context.succeed(event);
    }
    console.log('Login - UserMigration_Authentication', event);
  } else if (event.triggerSource == 'UserMigration_ForgotPassword') {
    console.log('Forgot Password - UserMigration_ForgotPassword', event);
  } else {
    // Return error to Amazon Cognito
    console.log('Bad triggerSource');
  }
};
