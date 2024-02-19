import { ROLES } from '../../entities/EntityConstants';
import { User } from '../../entities/User';

export const createPetitionerAccountInteractor = async (
  applicationContext: IApplicationContext,
  { email, name, userId }: { email: string; name: string; userId: string },
): Promise<void> => {
  const userEntity = new User({
    email,
    name,
    role: ROLES.petitioner,
    userId,
  });

  await applicationContext.getPersistenceGateway().persistUser({
    applicationContext,
    user: userEntity.validate().toRawObject(),
  });
};
