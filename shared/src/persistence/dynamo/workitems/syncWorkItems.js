const persistence = require('../../awsDynamoPersistence');
const client = require('../../dynamodbClientService');

exports.syncWorkItems = async ({
  applicationContext,
  caseToSave,
  currentCaseState,
}) => {
  let currentWorkItems = [];
  let newWorkItems = [];
  ((currentCaseState || {}).documents || []).forEach(
    document =>
      (currentWorkItems = [...currentWorkItems, ...(document.workItems || [])]),
  );
  (caseToSave.documents || []).forEach(
    document =>
      (newWorkItems = [...newWorkItems, ...(document.workItems || [])]),
  );

  for (let workItem of newWorkItems) {
    const existing = currentWorkItems.find(
      item => item.workItemId === workItem.workItemId,
    );
    if (!existing) {
      if (workItem.assigneeId) {
        await persistence.createMappingRecord({
          pkId: workItem.assigneeId,
          skId: workItem.workItemId,
          type: 'workItem',
          applicationContext,
        });
      }

      await persistence.createMappingRecord({
        applicationContext,
        pkId: workItem.section,
        skId: workItem.workItemId,
        type: 'workItem',
      });

      await client.put({
        applicationContext,
        TableName: `efcms-${applicationContext.environment.stage}`,
        Item: {
          pk: workItem.workItemId,
          sk: workItem.workItemId,
          ...workItem,
        },
      });
    } else {
      // the workItem exists in the current state, but check if the assigneeId changed
      if (workItem.assigneeId !== existing.assigneeId) {
        // the item has changed assignees, delete item
        await exports.reassignWorkItem({
          applicationContext,
          existingWorkItem: existing,
          workItemToSave: workItem,
        });
      }

      if (!existing.completedAt && workItem.completedAt) {
        await persistence.createSortMappingRecord({
          applicationContext,
          pkId: workItem.section,
          skId: workItem.completedAt,
          item: {
            workItemId: existing.workItemId,
          },
          type: 'sentWorkItem',
        });
      }

      if (caseToSave.status !== currentCaseState.status) {
        workItem.caseStatus = caseToSave.status;
        if (
          caseToSave.status === 'Batched for IRS' &&
          workItem.isInitializeCase
        ) {
          // TODO: this seems like business logic, refactor
          const batchedMessage = workItem.messages.find(
            message => message.message === 'Petition batched for IRS', // TODO: this probably shouldn't be hard coded
          );
          const { userId, createdAt } = batchedMessage;

          await persistence.createSortMappingRecord({
            applicationContext,
            pkId: userId,
            skId: createdAt,
            item: {
              workItemId: existing.workItemId,
            },
            type: 'sentWorkItem',
          });

          await persistence.createSortMappingRecord({
            applicationContext,
            pkId: existing.section,
            skId: createdAt,
            item: {
              workItemId: existing.workItemId,
            },
            type: 'sentWorkItem',
          });
        } else if (caseToSave.status === 'Recalled') {
          // TODO: this seems like business logic, refactor
          const batchedMessage = workItem.messages.find(
            message => message.message === 'Petition recalled from IRS Holding Queue', // TODO: this probably shouldn't be hard coded
          );
          const { userId, createdAt } = batchedMessage;

          await persistence.deleteMappingRecord({
            applicationContext,
            pkId: userId,
            skId: createdAt,
            type: 'sentWorkItem',
          });
          await persistence.deleteMappingRecord({
            applicationContext,
            pkId: 'petitions', // TODO: this probably shouldn't be hard coded
            skId: createdAt,
            type: 'sentWorkItem',
          });
        }
        await exports.updateWorkItem({
          applicationContext,
          workItemToSave: workItem,
        });
      }
    }
  }
};

exports.reassignWorkItem = async ({
  applicationContext,
  existingWorkItem,
  workItemToSave,
}) => {
  if (existingWorkItem.assigneeId) {
    await persistence.deleteMappingRecord({
      applicationContext,
      pkId: existingWorkItem.assigneeId,
      skId: workItemToSave.workItemId,
      type: 'workItem',
    });
  }

  if (existingWorkItem.section !== workItemToSave.section) {
    await persistence.deleteMappingRecord({
      applicationContext,
      pkId: existingWorkItem.section,
      skId: existingWorkItem.workItemId,
      type: 'workItem',
    });

    await persistence.createMappingRecord({
      applicationContext,
      pkId: workItemToSave.section,
      skId: workItemToSave.workItemId,
      type: 'workItem',
    });
  }

  await persistence.createMappingRecord({
    applicationContext,
    pkId: workItemToSave.assigneeId,
    skId: workItemToSave.workItemId,
    type: 'workItem',
  });
};

exports.updateWorkItem = async ({ applicationContext, workItemToSave }) => {
  await client.put({
    applicationContext,
    TableName: `efcms-${applicationContext.environment.stage}`,
    Item: {
      pk: workItemToSave.workItemId,
      sk: workItemToSave.workItemId,
      ...workItemToSave,
    },
  });
};
