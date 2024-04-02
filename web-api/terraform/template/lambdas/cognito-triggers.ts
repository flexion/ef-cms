export const handler = async event => {
  // const AWS = require('aws-sdk');
  // const stsclient = new AWS.STS();
  // const createNewUser = require('./createNewUser');

  // const sourceAccountRoleARN = 'ROLEARN';
  // const sourceAccountRegion = 'REGION';
  // const sourceAccountUserPoolId = 'USERPOOLID';
  // const sourceAccountClientId = 'APPCLIENTID';
  // let cognitoIdpClient;

  // let user;

  // const paramsAssumeRole = {
  //   RoleArn: sourceAccountRoleARN,
  //   RoleSessionName: 'CrossAccountCognitoMigration',
  // };
  // const { Credentials } = await stsclient
  //   .assumeRole(paramsAssumeRole)
  //   .promise();

  // const tempCredentialsObj = {
  //   accessKeyId: Credentials.AccessKeyId,
  //   secretAccessKey: Credentials.SecretAccessKey,
  //   sessionToken: Credentials.SessionToken,
  // };

  // AWS.config.update({ credentials: tempCredentialsObj });
  // cognitoIdpClient = new AWS.CognitoIdentityServiceProvider({
  //   region: sourceAccountRegion,
  // });

  if (event.triggerSource == 'UserMigration_Authentication') {
    // authenticate the user with existing user pool
    // user = await authenticateUser(event.userName, event.request.password);

    // let userAttributes = {};

    // if (user.Username) {
    //   user.UserAttributes.forEach(attribute => {
    //     if (attribute.Name == 'sub') {
    //       return;
    //     }
    //     userAttributes[attribute.Name] = attribute.Value;
    //   });

    //   await createNewUser(event.userName, event.request.password);

    //   event.response.userAttributes = userAttributes;

    //   event.response.finalUserStatus = 'CONFIRMED';
    //   event.response.messageAction = 'SUPPRESS';
    //   context.succeed(event);
    console.log('Login - UserMigration_Authentication', event);
  } else if (event.triggerSource == 'UserMigration_ForgotPassword') {
    console.log('Forgot Password - UserMigration_ForgotPassword', event);
  } else {
    // Return error to Amazon Cognito
    console.log('Bad triggerSource');
  }
};

// async function getUserPoolUser(username) {
//   let res = '';
//   const paramGetuser = {
//     UserPoolId: sourceAccountUserPoolId,
//     Username: username,
//   };

//   res = await cognitoIdpClient.adminGetUser(paramGetuser).promise();
//   return res;
// }

// async function authenticateUser(username, password) {
//   let res = '';
//   const paramInitiateAuth = {
//     AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
//     AuthParameters: {
//       PASSWORD: password,
//       USERNAME: username,
//     },
//     ClientId: sourceAccountClientId,
//     UserPoolId: sourceAccountUserPoolId,
//   };

//   const authres = await cognitoIdpClient
//     .adminInitiateAuth(paramInitiateAuth)
//     .promise();
//   if (authres.hasOwnProperty('AuthenticationResult')) {
//     res = getUserPoolUser(username);
//   }
//   return res;
// }
