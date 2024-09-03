/* eslint-disable prefer-destructuring */
import {
  AuthFlowType,
  ChallengeNameType,
  CognitoIdentityProvider,
} from '@aws-sdk/client-cognito-identity-provider';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { TOTP } from 'totp-generator';
import { environment } from '@web-api/environment';
import axios from 'axios';

describe('irsSuperUser', () => {
  if (process.env.DEPLOYING_COLOR === undefined) {
    throw new Error('Missing environment variable: DEPLOYING_COLOR');
  }
  let irsClientId, irsUserPoolId: string;

  const userName = 'ci_test_irs_super_user@example.com';
  const cognito = new CognitoIdentityProvider({
    maxAttempts: 3,
    region: 'us-east-1',
  });

  beforeAll(async () => {
    const result = await getIrsCognitoInfo({ cognito });
    irsClientId = result.irsClientId;
    irsUserPoolId = result.irsUserPoolId;

    // Delete USER
    try {
      await cognito.adminDeleteUser({
        UserPoolId: irsUserPoolId,
        Username: userName,
      });
      // eslint-disable-next-line no-empty
    } catch (e) {}
  });

  afterAll(async () => {
    // Delete USER
    try {
      await cognito.adminDeleteUser({
        UserPoolId: irsUserPoolId,
        Username: userName,
      });
      // eslint-disable-next-line no-empty
    } catch (e) {}
  });

  it('should be able to use an id token generated by the irs user pool to authenticate and get a reconciliation report', async () => {
    // Create User in IRS POOL
    const password = environment.defaultAccountPass;
    await createUserInIrsPool({
      cognito,
      irsUserPoolId,
      password,
      userName,
    });
    const { idToken } = await verifyUserAndGetIdToken({
      cognito,
      irsClientId,
      irsUserPoolId,
      password,
      userName,
    });

    // Use ID TOKEN to hit API
    const url = `https://api-${process.env.DEPLOYING_COLOR}.${environment.efcmsDomain}/v2/reconciliation-report/today`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        'x-test-user': 'true',
      },
    });

    // Verify we get a 200
    expect(response.status).toEqual(200);
  }, 60000);
});

async function verifyUserAndGetIdToken({
  cognito,
  irsClientId,
  irsUserPoolId,
  password,
  userName,
}: {
  cognito: CognitoIdentityProvider;
  password: string;
  userName: string;
  irsClientId: any;
  irsUserPoolId: string;
}): Promise<{ idToken: string }> {
  const initiateAuthResult = await cognito.adminInitiateAuth({
    AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
    AuthParameters: {
      PASSWORD: password,
      USERNAME: userName,
    },
    ClientId: irsClientId,
    UserPoolId: irsUserPoolId,
  });
  const associateResult = await cognito.associateSoftwareToken({
    Session: initiateAuthResult.Session,
  });
  if (!associateResult.SecretCode) {
    throw new Error('Could not generate Secret Code');
  }
  const { otp } = TOTP.generate(associateResult.SecretCode);
  const verifyTokenResult = await cognito.verifySoftwareToken({
    Session: associateResult.Session,
    UserCode: otp,
  });
  const challengeResponse = await cognito.respondToAuthChallenge({
    ChallengeName: ChallengeNameType.MFA_SETUP,
    ChallengeResponses: {
      USERNAME: userName,
    },
    ClientId: irsClientId,
    Session: verifyTokenResult.Session,
  });
  if (!challengeResponse.AuthenticationResult?.IdToken) {
    throw new Error('An ID token was not generated for the IRS Superuser.');
  }
  return { idToken: challengeResponse.AuthenticationResult?.IdToken };
}

async function createUserInIrsPool({
  cognito,
  irsUserPoolId,
  password,
  userName,
}: {
  cognito: CognitoIdentityProvider;
  userName: string;
  password: string;
  irsUserPoolId: string;
}): Promise<void> {
  await cognito.adminCreateUser({
    TemporaryPassword: password,
    UserAttributes: [
      {
        Name: 'name',
        Value: 'irsSuperUser CI/CD',
      },
      {
        Name: 'custom:userId',
        Value: '37808c8c-e658-4ff9-a57e-bbb64f0e6065',
      },
      {
        Name: 'custom:role',
        Value: ROLES.irsSuperuser,
      },
      {
        Name: 'custom:userId',
        Value: '14de78aa-b148-4a55-a2a1-875253e414f3',
      },
      {
        Name: 'email',
        Value: userName,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
    ],
    UserPoolId: irsUserPoolId,
    Username: userName,
  });

  await cognito.adminSetUserPassword({
    Password: password,
    Permanent: true,
    UserPoolId: irsUserPoolId,
    Username: userName,
  });
}

async function getIrsCognitoInfo({
  cognito,
}: {
  cognito: CognitoIdentityProvider;
}): Promise<{ irsUserPoolId: string; irsClientId: string }> {
  const results = await cognito.listUserPools({
    MaxResults: 50,
  });
  const irsUserPoolId = results?.UserPools?.find(
    pool => pool.Name === `efcms-irs-${environment.stage}`,
  )?.Id;

  if (!irsUserPoolId) {
    throw new Error('Could not get userPoolId');
  }

  const userPoolClients = await cognito.listUserPoolClients({
    MaxResults: 20,
    UserPoolId: irsUserPoolId,
  });
  const irsClientId = userPoolClients?.UserPoolClients?.[0].ClientId;

  if (!irsClientId) {
    throw new Error(
      `Unable to find a client for the IRS Superuser pool: ${irsUserPoolId}`,
    );
  }

  return {
    irsClientId,
    irsUserPoolId,
  };
}
