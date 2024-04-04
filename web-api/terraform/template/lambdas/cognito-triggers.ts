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
  console.log('triggerSource', event.triggerSource);

  const applicationContext: ServerApplicationContext = createApplicationContext(
    {},
  );

  if (event.triggerSource === 'UserMigration_Authentication') {
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

      event.response.userAttributes = userAttributes;
      event.response.finalUserStatus = 'CONFIRMED';
      event.response.messageAction = 'SUPPRESS';

      // context.succeed(event);
      return event;
    }
  } else if (event.triggerSource === 'UserMigration_ForgotPassword') {
    const { Users: users } = await applicationContext.getCognito().listUsers({
      Filter: `email = "${event.userName}"`,
      UserPoolId: 'us-east-1_jDerGoxYK', // OLD user pool id
    });

    if (users) {
      let userAttributes: AttributeType[] = [];
      let sub, customUserId;

      if (users[0].Username) {
        users[0].Attributes?.forEach(attribute => {
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
      }

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

      // event.response.userAttributes = userAttributes;
      // event.response.messageAction = 'SUPPRESS';

      console.log('createUserResult: ', createUserResult);

      return createUserResult.User!;
    }
  } else {
    // return message that code has been sent even if user not found
    // Return error to Amazon Cognito
    console.log('Bad triggerSource');
  }
};
