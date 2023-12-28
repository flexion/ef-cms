import { ServerApplicationContext } from '@web-api/applicationContext';
import { TDynamoRecord } from '../../../../../src/persistence/dynamo/dynamoTypes';

const isCaseRecord = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('case|');
};

const isCaseDeadline = item => {
  return (
    item.pk.startsWith('case-deadline|') && item.sk.startsWith('case-deadline|')
  );
};

const isWorkItem = item => {
  return item.gsi1pk?.startsWith('work-item|');
};

const isRecordToUpdate = item => {
  return isCaseRecord(item) || isCaseDeadline(item) || isWorkItem(item);
};

let judgesMap: { [key: string]: string } | null = null;

export const migrateItems = async (
  items: any[],
  _,
  applicationContext: ServerApplicationContext,
) => {
  const itemsAfter: TDynamoRecord[] = [];

  for (const item of items) {
    if (
      isRecordToUpdate(item) &&
      item.associatedJudge &&
      item.associatedJudge !== 'Chief Judge'
    ) {
      if (!judgesMap) {
        const judgeRecords = await applicationContext
          .getPersistenceGateway()
          .getAllUsersByRole(applicationContext, ['judge', 'legacyJudge']);

        judgesMap = judgeRecords.reduce(
          (accumulator, judge) => {
            accumulator[judge.name] = judge.userId;
            return accumulator;
          },
          {} as { [key: string]: string },
        );
      }
      item.associatedJudgeId = judgesMap[item.associatedJudge];
    }

    itemsAfter.push(item);
  }

  return itemsAfter;
};