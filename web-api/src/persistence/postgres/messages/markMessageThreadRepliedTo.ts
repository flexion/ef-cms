import { db } from '@web-api/database';
import { getMessageThreadByParentId } from './getMessageThreadByParentId';

/**
 * markMessageThreadRepliedTo
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.parentMessageId the id of the parent message to update
 * @returns {object} the updated messages
 */
export const markMessageThreadRepliedTo = async ({
  parentMessageId,
}: {
  parentMessageId: string;
}): Promise<void> => {
  const messages = await getMessageThreadByParentId({
    parentMessageId,
  });

  if (messages.length) {
    await Promise.all(
      messages.map(async message => {
        await db
          .updateTable('message')
          .set({
            isRepliedTo: true,
          })
          .where('messageId', '=', message.messageId)
          .execute();
      }),
    );
  }
};
