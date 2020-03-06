const client = require('../../dynamodbClientService');
const {
  updateWorkItemAssociatedJudge,
} = require('../workitems/updateWorkItemAssociatedJudge');
const {
  updateWorkItemCaseIsInProgress,
} = require('../workitems/updateWorkItemCaseIsInProgress');
const {
  updateWorkItemCaseStatus,
} = require('../workitems/updateWorkItemCaseStatus');
const {
  updateWorkItemCaseTitle,
} = require('../workitems/updateWorkItemCaseTitle');
const {
  updateWorkItemDocketNumberSuffix,
} = require('../workitems/updateWorkItemDocketNumberSuffix');
const {
  updateWorkItemTrialDate,
} = require('../workitems/updateWorkItemTrialDate');
const { differenceWith, isEqual } = require('lodash');

/**
 * updateCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseToUpdate the case data to update
 * @returns {Promise} the promise of the persistence calls
 */
exports.updateCase = async ({ applicationContext, caseToUpdate }) => {
  const oldCase = await client.get({
    Key: {
      pk: `case|${caseToUpdate.caseId}`,
      sk: `case|${caseToUpdate.caseId}`,
    },
    applicationContext,
  });

  const requests = [];

  let updatedDocketRecord = differenceWith(
    caseToUpdate.docketRecord,
    oldCase.docketRecord,
    isEqual,
  );

  updatedDocketRecord.forEach(docketEntry => {
    requests.push(
      client.put({
        Item: {
          pk: `case|${caseToUpdate.caseId}`,
          sk: `docket-record|${docketEntry.docketRecordId}`,
          ...docketEntry,
        },
        applicationContext,
      }),
    );
  });

  if (
    oldCase.status !== caseToUpdate.status ||
    oldCase.docketNumberSuffix !== caseToUpdate.docketNumberSuffix ||
    oldCase.caseCaption !== caseToUpdate.caseCaption ||
    oldCase.trialDate !== caseToUpdate.trialDate ||
    oldCase.associatedJudge !== caseToUpdate.associatedJudge ||
    oldCase.caseIsInProgress !== caseToUpdate.caseIsInProgress
  ) {
    const workItemMappings = await client.query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${caseToUpdate.caseId}`,
        ':prefix': 'work-item',
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      applicationContext,
    });

    for (let mapping of workItemMappings) {
      const [, workItemId] = mapping.sk.split('|');
      if (oldCase.status !== caseToUpdate.status) {
        requests.push(
          updateWorkItemCaseStatus({
            applicationContext,
            caseStatus: caseToUpdate.status,
            workItemId,
          }),
        );
      }
      if (oldCase.caseCaption !== caseToUpdate.caseCaption) {
        requests.push(
          updateWorkItemCaseTitle({
            applicationContext,
            caseTitle: caseToUpdate.caseCaption,
            workItemId,
          }),
        );
      }
      if (oldCase.docketNumberSuffix !== caseToUpdate.docketNumberSuffix) {
        requests.push(
          updateWorkItemDocketNumberSuffix({
            applicationContext,
            docketNumberSuffix: caseToUpdate.docketNumberSuffix || null,
            workItemId,
          }),
        );
      }
      if (oldCase.trialDate !== caseToUpdate.trialDate) {
        requests.push(
          updateWorkItemTrialDate({
            applicationContext,
            trialDate: caseToUpdate.trialDate || null,
            workItemId,
          }),
        );
      }
      if (oldCase.associatedJudge !== caseToUpdate.associatedJudge) {
        requests.push(
          updateWorkItemAssociatedJudge({
            applicationContext,
            associatedJudge: caseToUpdate.associatedJudge,
            workItemId,
          }),
        );
      }
      if (oldCase.inProgress !== caseToUpdate.inProgress) {
        requests.push(
          updateWorkItemCaseIsInProgress({
            applicationContext,
            caseIsInProgress: caseToUpdate.inProgress,
            workItemId,
          }),
        );
      }
    }
  }

  let setLeadCase = caseToUpdate.leadCaseId
    ? { gsi1pk: caseToUpdate.leadCaseId }
    : {};

  const [results] = await Promise.all([
    client.put({
      Item: {
        pk: `case|${caseToUpdate.caseId}`,
        sk: `case|${caseToUpdate.caseId}`,
        ...setLeadCase,
        ...caseToUpdate,
      },
      applicationContext,
    }),
    ...requests,
  ]);

  return results;
};
