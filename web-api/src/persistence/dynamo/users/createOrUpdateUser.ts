import * as client from '../../dynamodbClientService';
import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { InvalidRequest } from '@web-api/errors/errors';
import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const createOrUpdateUser = async (
  applicationContext: ServerApplicationContext,
  {
    password,
    user,
  }: {
    password: string;
    user: RawUser;
  },
): Promise<{ userId: string }> => {
  let userPoolId =
    user.role === ROLES.irsSuperuser
      ? process.env.USER_POOL_IRS_ID
      : process.env.USER_POOL_ID;

  if (!user.email) {
    throw new InvalidRequest(
      'Unable to create an account, email was not provided.',
    );
  }

  const emailHasAccount = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, {
      email: user.email,
      userPoolId,
    });

  let userId: string;
  if (!emailHasAccount) {
    userId = await applicationContext
      .getUserGateway()
      .createUser(applicationContext, {
        email: user.email,
        name: user.name,
        password,
        role: user.role,
        userPoolId,
      });
  } else {
    userId = await applicationContext
      .getUserGateway()
      .updateUser(applicationContext, {
        email: user.email,
        role: user.role,
        userPoolId,
      });
  }

  return await createUserRecords({
    applicationContext,
    user,
    userId,
  });
};

export const createUserRecords = async ({
  applicationContext,
  user,
  userId,
}: {
  applicationContext: ServerApplicationContext;
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
