import { Message, RawMessage } from '@shared/business/entities/Message';
import { dbWrite } from '@web-api/database';
import { toKyselyUpdateMessage } from './mapper';
import { transformNullToUndefined } from '../utils/transformNullToUndefined';

export const updateMessage = async ({
  message,
}: {
  message: RawMessage;
}): Promise<Message> => {
  const updatedMessage = await dbWrite
    .updateTable('message')
    .set(toKyselyUpdateMessage(message))
    .where('messageId', '=', message.messageId)
    .returningAll()
    .executeTakeFirst();

  if (!updatedMessage) {
    throw new Error('could not update the message');
  }

  return new Message(transformNullToUndefined(message)).validate();
};