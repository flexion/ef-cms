import {
  AdminGetUserCommandOutput,
  AdminInitiateAuthCommandOutput,
  MessageActionType,
  UserStatusType,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';

// TODO Handle Post Migration, Set Flag? Or Delete User?
export const handler = async event => {
  const applicationContext: ServerApplicationContext = createApplicationContext(
    {},
  );

  if (event.triggerSource === 'UserMigration_Authentication') {
    const result = await initiateAuthCaseSensitive({
      applicationContext,
      email: event.userName,
      password: event.request.password,
    });

    let user: AdminGetUserCommandOutput;
    if (result.hasOwnProperty('AuthenticationResult')) {
      user = await getUserCaseSensitive({
        applicationContext,
        email: event.userName,
      });
    } else {
      return;
    }

    if (user.UserStatus === UserStatusType.UNCONFIRMED) {
      // signUp
    }

    if (user.UserStatus === UserStatusType.FORCE_CHANGE_PASSWORD) {
      // ???
    }

    if (user.UserStatus === UserStatusType.CONFIRMED) {
      let userAttributes = {};
      let sub, customUserId;

      user.UserAttributes?.forEach(attribute => {
        if (attribute.Name == 'sub') {
          sub = attribute.Value;
          return;
        }
        if (attribute.Name === 'custom:userId') {
          customUserId = attribute.Value;
          return;
        }
        userAttributes[attribute.Name!] = attribute.Value;
      });

      const createUserResult = await createUserCaseInsensitive({
        applicationContext,
        customUserId,
        email: event.userName,
        password: event.request.password,
        sub,
        userAttributes,
      });

      if (createUserResult?.User?.UserStatus == 'FORCE_CHANGE_PASSWORD') {
        await setUserPassword({
          applicationContext,
          email: createUserResult.User.Username!,
          password: event.request.password,
        });
      }

      // event.response.userAttributes = userAttributes;
      // event.response.finalUserStatus = 'CONFIRMED';
      // event.response.messageAction = 'SUPPRESS';

      return event;
    }
  } else if (event.triggerSource === 'UserMigration_ForgotPassword') {
    console.log(
      'UserMigration_ForgotPassword - event.userName',
      event.userName,
    );

    const { Users: users } = await applicationContext.getCognito().listUsers({
      Filter: `email = "${event.userName}"`,
      UserPoolId: 'us-east-1_jDerGoxYK', // OLD user pool id
    });

    if (users) {
      console.log('UserMigration_ForgotPassword - users', users);

      const foundUser = users[0];

      console.log('UserMigration_ForgotPassword - foundUser', foundUser);

      let userAttributes: {} = {};
      let sub, customUserId;

      foundUser.Attributes?.forEach(attribute => {
        if (attribute.Name == 'sub') {
          sub = attribute.Value;
          return;
        }
        if (attribute.Name === 'custom:userId') {
          customUserId = attribute.Value;
          return;
        }
        userAttributes[attribute.Name!] = attribute.Value;
      });

      userAttributes['custom:userId'] = customUserId || sub;

      event.response.userAttributes = userAttributes;
      event.response.finalUserStatus = foundUser.UserStatus;
      event.response.messageAction = MessageActionType.SUPPRESS;

      return event;
    }
  } else {
    console.log('Unrecognized trigger source', event.triggerSource);
  }
};

async function initiateAuthCaseSensitive({
  applicationContext,
  email,
  password,
}: {
  applicationContext: ServerApplicationContext;
  email: string;
  password: string;
}): Promise<AdminInitiateAuthCommandOutput> {
  return await applicationContext.getCognito().adminInitiateAuth({
    AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
    AuthParameters: {
      PASSWORD: password,
      USERNAME: email,
    },
    ClientId: '2em8dvalgn7eednvasqa6reok3', // OLD user pool
    UserPoolId: 'us-east-1_jDerGoxYK', // OLD user pool
  });
}

async function getUserCaseSensitive({
  applicationContext,
  email,
}: {
  applicationContext: ServerApplicationContext;
  email: string;
}): Promise<AdminGetUserCommandOutput> {
  return await applicationContext.getCognito().adminGetUser({
    UserPoolId: 'us-east-1_jDerGoxYK', // OLD user pool
    Username: email,
  });
}

async function createUserCaseInsensitive({
  applicationContext,
  customUserId,
  email,
  password,
  sub,
  userAttributes,
}: {
  applicationContext: ServerApplicationContext;
  password: string;
  email: string;
  customUserId: string;
  sub: string;
  userAttributes: {};
}) {
  return await applicationContext.getCognito().adminCreateUser({
    TemporaryPassword: password,
    UserAttributes: [
      // ...Object.entries(userAttributes),
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
    Username: email,
  });
}

async function setUserPassword({
  applicationContext,
  email,
  password,
}: {
  applicationContext: ServerApplicationContext;
  password: string;
  email: string;
}) {
  await applicationContext.getCognito().adminSetUserPassword({
    Password: password,
    Permanent: true,
    UserPoolId: 'us-east-1_cH7eMtBTZ', // NEW user pool id
    Username: email,
  });
}
