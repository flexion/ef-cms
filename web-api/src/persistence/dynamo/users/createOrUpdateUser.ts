import * as client from '../../dynamodbClientService';
import {
  CognitoIdentityProvider,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const createUserRecords = async ({
  applicationContext,
  user,
  userId,
}: {
  applicationContext: IApplicationContext;
  user: any;
  userId: string;
}) => {
  delete user.password;

  if (user.barNumber === '') {
    delete user.barNumber;
  }

  if (user.section) {
    // we never have a need to query users by these sections, and since there are SO many
    // users in these sections, it locks up the migration.  We should use elasticsearch if we
    // have a future need to query for users by section
    if (
      user.section !== ROLES.privatePractitioner &&
      user.section !== ROLES.petitioner &&
      user.section !== ROLES.inactivePractitioner &&
      user.section !== ROLES.irsPractitioner
    ) {
      await client.put({
        Item: {
          pk: `section|${user.section}`,
          sk: `user|${userId}`,
        },
        applicationContext,
      });
    }

    if (user.role === ROLES.judge || user.role === ROLES.legacyJudge) {
      await client.put({
        Item: {
          pk: 'section|judge',
          sk: `user|${userId}`,
        },
        applicationContext,
      });
    }

    if (user.role === ROLES.caseServicesSupervisor) {
      await client.put({
        Item: {
          pk: `section|${DOCKET_SECTION}`,
          sk: `user|${userId}`,
        },
        applicationContext,
      });
      await client.put({
        Item: {
          pk: `section|${PETITIONS_SECTION}`,
          sk: `user|${userId}`,
        },
        applicationContext,
      });
    }
  }

  await client.put({
    Item: {
      ...user,
      pk: `user|${userId}`,
      sk: `user|${userId}`,
      userId,
    },
    applicationContext,
  });

  if (
    (user.role === ROLES.privatePractitioner ||
      user.role === ROLES.irsPractitioner) &&
    user.name &&
    user.barNumber
  ) {
    const upperCaseName = user.name.toUpperCase();
    await client.put({
      Item: {
        pk: `${user.role}|${upperCaseName}`,
        sk: `user|${userId}`,
      },
      applicationContext,
    });
    const upperCaseBarNumber = user.barNumber.toUpperCase();
    await client.put({
      Item: {
        pk: `${user.role}|${upperCaseBarNumber}`,
        sk: `user|${userId}`,
      },
      applicationContext,
    });
  }

  return {
    ...user,
    userId,
  };
};

export const isUserAlreadyCreated = async ({
  applicationContext,
  email,
  userPoolId,
}: {
  applicationContext: IApplicationContext;
  email: string;
  userPoolId: string;
}) => {
  const cognito: CognitoIdentityProvider = applicationContext.getCognito();

  try {
    await cognito.adminGetUser({
      UserPoolId: userPoolId,
      Username: email,
    });

    return true;
  } catch (e) {
    if (e instanceof UserNotFoundException) {
      return false;
    } else {
      throw e;
    }
  }
};

export const createOrUpdateUser = async ({
  applicationContext,
  disableCognitoUser = false,
  password,
  user,
}: {
  applicationContext: ServerApplicationContext;
  disableCognitoUser: boolean;
  password: string;
  user: RawUser;
}) => {
  let userId;
  let userPoolId =
    user.role === ROLES.irsSuperuser
      ? process.env.USER_POOL_IRS_ID
      : process.env.USER_POOL_ID;

  const userExists = await isUserAlreadyCreated({
    applicationContext,
    email: user.email,
    userPoolId: userPoolId as string,
  });

  const cognito: CognitoIdentityProvider = applicationContext.getCognito();

  if (!userExists) {
    userId = await applicationContext
      .getUserGateway()
      .createUser(applicationContext, {
        email: user.email,
        name: user.name,
        password,
        role: user.role,
      });
  } else {
    userId = await applicationContext
      .getUserGateway()
      .updateUser(applicationContext, { email: user.email, role: user.role });
  }

  if (disableCognitoUser) {
    await cognito.adminDisableUser({
      UserPoolId: userPoolId,
      Username: userId,
    });
  }

  return await createUserRecords({
    applicationContext,
    user,
    userId,
  });
};
