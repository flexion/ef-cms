import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import { RawPractitioner } from '../../entities/Practitioner';
import { RawUser } from '../../entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const queueUpdateAssociatedCasesWorker = async (
  applicationContext: ServerApplicationContext,
  { user }: { user: RawUser | RawPractitioner },
): Promise<void> => {
  const docketNumbersAssociatedWithUser = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByUser({
      applicationContext,
      userId: user.userId,
    });

  await Promise.all(
    docketNumbersAssociatedWithUser.map(docketNumber =>
      applicationContext.getWorkerGateway().initialize(applicationContext, {
        message: {
          payload: { docketNumber, user },
          type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
        },
      }),
    ),
  );

  return;
};
