import { Message } from '@shared/business/entities/Message';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/database';
import { messageResultEntity } from '@web-api/persistence/postgres/messages/mapper';

export const getCompletedSectionInboxMessages = async ({
  section,
}: {
  section: string;
}): Promise<Message[]> => {
  const filterDate = calculateISODate({ howMuch: -7 });

  const messages = await getDbReader(reader =>
    reader
      .selectFrom('message as m')
      .leftJoin('case as c', 'c.docketNumber', 'm.docketNumber')
      .where('m.completedBySection', '=', section)
      .where('m.isCompleted', '=', true)
      .where('m.createdAt', '>=', filterDate)
      .selectAll()
      .select('m.docketNumber')
      .limit(5000)
      .execute(),
  );

  return messages.map(message => messageResultEntity(message));
};
