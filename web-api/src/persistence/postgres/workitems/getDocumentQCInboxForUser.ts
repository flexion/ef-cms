import { WorkItem } from '@shared/business/entities/WorkItem';
import { getDbReader } from '@web-api/database';
import { workItemEntity } from '@web-api/persistence/postgres/workitems/mapper';

export const getDocumentQCInboxForUser = async ({
  userId,
}: {
  userId: string;
}): Promise<WorkItem[]> => {
  const workItems = await getDbReader(reader => {
    return reader
      .selectFrom('workItem as w')
      .leftJoin('case as c', 'c.docketNumber', 'w.docketNumber')
      .where('w.assigneeId', '=', userId)
      .selectAll()
      .select('w.docketNumber')
      .execute();
  });

  return workItems.map(workItem => workItemEntity(workItem));
};
