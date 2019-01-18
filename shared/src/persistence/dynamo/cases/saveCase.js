const {
  createRespondentCaseMapping,
  stripInternalKeys,
  stripWorkItems,
  createMappingRecord,
} = require('../../awsDynamoPersistence');
const { syncWorkItems } = require('../../dynamo/workitems/syncWorkItems');
const { syncDocuments } = require('../../dynamo/documents/syncDocuments');

const client = require('../../dynamodbClientService');

/**
 * saveCase
 * @param caseToSave
 * @param applicationContext
 * @returns {*}
 */
exports.saveCase = async ({ caseToSave, applicationContext }) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;
  const currentCaseState = await client.get({
    applicationContext,
    TableName: TABLE,
    Key: {
      pk: caseToSave.caseId,
      sk: '0',
    },
  });

  if (!currentCaseState) {
    await createMappingRecord({
      pkId: caseToSave.userId,
      skId: caseToSave.caseId,
      type: 'case',
      applicationContext,
    });

    await createMappingRecord({
      pkId: caseToSave.docketNumber,
      skId: caseToSave.caseId,
      type: 'case',
      applicationContext,
    });
  }

  const currentStatus = (currentCaseState || {}).status;

  if (
    currentCaseState &&
    !currentCaseState.respondent &&
    caseToSave.respondent
  ) {
    await createRespondentCaseMapping({
      applicationContext,
      caseId: caseToSave.caseId,
      respondentId: caseToSave.respondent.respondentId,
    });
  }

  await syncWorkItems({
    applicationContext,
    caseToSave,
    currentCaseState,
  });

  await syncDocuments({
    applicationContext,
    caseToSave,
    currentCaseState,
  });

  if (currentStatus !== caseToSave.status) {
    if (currentStatus) {
      await client.delete({
        applicationContext,
        tableName: TABLE,
        key: {
          pk: `${currentStatus}|case-status`,
          sk: caseToSave.caseId,
        },
      });
    }

    await client.put({
      applicationContext,
      TableName: TABLE,
      Item: {
        pk: `${caseToSave.status}|case-status`,
        sk: caseToSave.caseId,
      },
    });
  }

  // used for associating a case to the latest version
  const currentVersion = (currentCaseState || {}).currentVersion;
  const nextVersionToSave = parseInt(currentVersion || '0') + 1;

  // update the current history
  const results = await client.put({
    applicationContext,
    TableName: TABLE,
    Item: {
      pk: caseToSave.caseId,
      sk: '0',
      ...caseToSave,
      currentVersion: `${nextVersionToSave}`,
    },
  });

  // add a history entry
  await client.put({
    applicationContext,
    TableName: TABLE,
    Item: {
      pk: caseToSave.caseId,
      sk: `${nextVersionToSave}`,
      ...caseToSave,
      currentVersion: `${nextVersionToSave}`,
    },
  });

  return stripWorkItems(
    stripInternalKeys(results),
    applicationContext.isAuthorizedForWorkItems(),
  );
};
