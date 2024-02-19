import { InvalidRequest, NotFoundError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const confirmSignUpInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    confirmationCode,
    email,
    userId,
  }: { confirmationCode: string; userId: string; email: string },
): Promise<void> => {
  const accountConfirmationCode = await applicationContext
    .getPersistenceGateway()
    .getAccountConfirmationCode(applicationContext, { userId });

  if (accountConfirmationCode !== confirmationCode) {
    applicationContext.logger.info(
      'action: user_did_not_confirm_account_within_24hr',
    );

    throw new InvalidRequest('Confirmation code expired');
  }

  const confirmSignUp = applicationContext
    .getUserGateway()
    .confirmSignUp(applicationContext, {
      email,
    });

  await Promise.all([
    confirmSignUp,
    createPetitionerUser(applicationContext, { email, userId }),
  ]);
};

const createPetitionerUser = async (
  applicationContext: ServerApplicationContext,
  { email, userId }: { email: string; userId: string },
) => {
  const user = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, { email });

  if (!user) {
    throw new NotFoundError(`User not found with email: ${email}`);
  }

  await applicationContext
    .getUseCases()
    .createPetitionerAccountInteractor(applicationContext, {
      email,
      name: user.name,
      userId,
    });
};
