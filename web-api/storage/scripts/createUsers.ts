import {
  ROLES,
  Role,
} from '../../../shared/src/business/entities/EntityConstants';
import { createApplicationContext } from '../../src/applicationContext';
import { createPetitionerUserRecords } from '../../../web-api/src/persistence/dynamo/users/createPetitionerUserRecords';
import { createUserRecords as createPractitionerUserRecords } from '../../../web-api/src/persistence/dynamo/users/createOrUpdatePractitionerUser';
import { createUserRecords } from '../../../web-api/src/persistence/dynamo/users/createOrUpdateUser';
import { omit } from 'lodash';
import users from '../fixtures/seed/users.json';

let usersByEmail = {};

const EXCLUDE_PROPS = ['pk', 'sk', 'userId'];

export const createUsers = async () => {
  usersByEmail = {};

  const applicationContext = createApplicationContext({
    role: ROLES.admin,
  });

  await Promise.all(
    users.map(async userRecord => {
      if (!userRecord.userId) {
        throw new Error('User has no uuid');
      }

      const practitionerRoles: Role[] = [
        ROLES.irsPractitioner,
        ROLES.privatePractitioner,
        ROLES.inactivePractitioner,
      ];
      if (practitionerRoles.includes(userRecord.role as Role)) {
        const userCreated = await createPractitionerUserRecords({
          applicationContext,
          user: omit(userRecord, EXCLUDE_PROPS),
          userId: userRecord.userId,
        });

        if (usersByEmail[userCreated.email]) {
          throw new Error(`User ${JSON.stringify(userRecord)} already exists`);
        }

        usersByEmail[userCreated.email] = userCreated;
        return;
      }

      if (userRecord.role === ROLES.petitioner) {
        const userCreated = await createPetitionerUserRecords({
          applicationContext,
          user: omit(userRecord, EXCLUDE_PROPS),
          userId: userRecord.userId,
        });

        if (usersByEmail[userCreated.email]) {
          throw new Error(`User ${JSON.stringify(userRecord)} already exists`);
        }

        usersByEmail[userCreated.email] = userCreated;
        return;
      }

      const userCreated = await createUserRecords({
        applicationContext,
        user: omit(userRecord, EXCLUDE_PROPS),
        userId: userRecord.userId,
      });

      if (usersByEmail[userCreated.email]) {
        throw new Error(`User ${JSON.stringify(userRecord)} already exists`);
      }

      usersByEmail[userCreated.email] = userCreated;
      return;
    }),
  );
};
