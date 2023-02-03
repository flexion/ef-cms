import { WorkItemClass } from '../../../business/entities/WorkItem';
import { deleteByGsi } from '../helpers/deleteByGsi';

export const deleteWorkItem = ({
  applicationContext,
  workItem,
}: {
  applicationContext: IApplicationContext;
  workItem: WorkItemClass;
}) =>
  deleteByGsi({ applicationContext, gsi: `work-item|${workItem.workItemId}` });
