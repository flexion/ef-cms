import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

const ENV = Cypress.env('ENV');

const cognito = new CognitoIdentityProvider({
  accessKeyId: Cypress.env('AWS_ACCESS_KEY_ID'),
  region: 'us-east-1',
  secretAccessKey: Cypress.env('AWS_SECRET_ACCESS_KEY'),
  sessionToken: Cypress.env('AWS_SESSION_TOKEN'),
});

const getClientId = async userPoolId => {
  const results = await cognito.listUserPoolClients({
    MaxResults: 60,
    UserPoolId: userPoolId,
  });
  const clientId = results.UserPoolClients[0].ClientId;
  return clientId;
};

const getUserPoolId = async () => {
  const results = await cognito.listUserPools({
    MaxResults: 50,
  });
  const userPoolId = results.UserPools.find(
    pool => pool.Name === `efcms-${ENV}`,
  ).Id;
  return userPoolId;
};

exports.getUserToken = async (username, password) => {
  const userPoolId = await getUserPoolId();
  const clientId = await getClientId(userPoolId);

  return cognito.adminInitiateAuth({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    AuthParameters: {
      PASSWORD: password,
      USERNAME: username,
    },
    ClientId: clientId,
    UserPoolId: userPoolId,
  });
};

exports.login = token => {
  cy.visit(`/log-in?token=${token}`);
  cy.get('.progress-indicator').should('not.exist');
  cy.get('.big-blue-header').should('exist');
};
