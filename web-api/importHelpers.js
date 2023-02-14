import { APIGateway } from '@aws-sdk/client-api-gateway';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
const fs = require('fs');
const jwt = require('jsonwebtoken');
const localUsers = require('./storage/fixtures/seed/users.json');
const { getUserToken } = require('./storage/scripts/loadTest/loadTestHelpers');

const getToken = async () => {
  if (process.env.ENV === 'local') {
    const adminUser = localUsers.find(user => user.role === 'admin');
    const user = {
      ...adminUser,
      'custom:role': adminUser.role,
      sub: adminUser.userId,
    };

    return Promise.resolve(jwt.sign(user, 'secret'));
  }

  const cognito = new CognitoIdentityProvider({
    region: process.env.REGION,
  });

  return await getUserToken({
    cognito,
    env: process.env.ENV,
    password: process.env.USTC_ADMIN_PASS,
    username: process.env.USTC_ADMIN_USER,
  });
};

const getServices = async () => {
  const apigateway = new APIGateway({
    region: process.env.REGION,
  });
  const { items: apis } = await apigateway.getRestApis({ limit: 200 });

  return apis
    .filter(api =>
      api.name.includes(
        `gateway_api_${process.env.ENV}_${process.env.DEPLOYING_COLOR}`,
      ),
    )
    .reduce((obj, api) => {
      obj[
        api.name.replace(`_${process.env.ENV}`, '')
      ] = `https://${api.id}.execute-api.${process.env.REGION}.amazonaws.com/${process.env.ENV}`;
      return obj;
    }, {});
};

const readCsvFile = file => {
  return fs.readFileSync(file, 'utf8');
};

module.exports = {
  getServices,
  getToken,
  readCsvFile,
};
