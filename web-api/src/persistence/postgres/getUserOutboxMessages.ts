import { Message } from '@shared/business/entities/Message';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import { getDataSource } from '@web-api/data-source';
import { Message as messageRepo } from '@web-api/persistence/repository/Message';
import { transformNullToUndefined } from 'postgres/helpers/transformNullToUndefined';

export const getUserOutboxMessages = async ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}) => {
  const filterDate = calculateISODate({ howMuch: -7 });

  const dataSource = await getDataSource();
  const messageRepository = dataSource.getRepository(messageRepo);

  const messages = await messageRepository
    .createQueryBuilder('message')
    .where('message.fromUserId = :userId', { userId })
    .andWhere('message.createdAt >= :filterDate', { filterDate })
    .limit(5000)
    .getMany();

  return messages.map(
    message =>
      new Message(transformNullToUndefined(message), { applicationContext }),
  );
};
