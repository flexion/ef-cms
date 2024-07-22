import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

export const getInboxMessagesForUserLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getInboxMessagesForUserInteractor(
        applicationContext,
        {
          userId: event.pathParameters.userId,
        },
        authorizedUser,
      );
  });
