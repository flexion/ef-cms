import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../../../web-api/src/errors/errors';
import { User } from '../../entities/User';

export const getUsersInSectionInteractor = async (
  applicationContext: IApplicationContext,
  { section }: { section: string },
) => {
  const user = applicationContext.getCurrentUser();
  let rolePermission;

  if (section === 'judge') {
    rolePermission = ROLE_PERMISSIONS.GET_JUDGES;
  } else {
    rolePermission = ROLE_PERMISSIONS.GET_USERS_IN_SECTION;
  }

  if (!isAuthorized(user, rolePermission)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const rawUsers: User[] = await applicationContext
    .getPersistenceGateway()
    .getUsersInSection({
      applicationContext,
      section,
    });

  return User.validateRawCollection(rawUsers, { applicationContext });
};
