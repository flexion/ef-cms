const client = require('../../dynamodbClientService');
const {
  getCaseDeadlinesByDocketNumber,
} = require('../caseDeadlines/getCaseDeadlinesByDocketNumber');

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
const { Case } = require('../../../business/entities/cases/Case');
const { createCaseDeadline } = require('../caseDeadlines/createCaseDeadline');
const { fieldsToOmitBeforePersisting } = require('./createCase');
const { omit, pick } = require('lodash');
const { updateMessage } = require('../messages/updateMessage');

const updateUserCaseMappings = ({
  applicationContext,
  caseToUpdate,
  userCaseMappings,
}) => {
  const updatedAttributeValues = pick(caseToUpdate, [
    'caseCaption',
    'closedDate',
    'docketNumberSuffix',
    'docketNumberWithSuffix',
    'leadDocketNumber',
    'status',
  ]);

  const updatedUserCases = userCaseMappings.map(userCaseItem =>
    Object.assign({}, userCaseItem, updatedAttributeValues),
  );

  const gsi1pk = `user-case|${caseToUpdate.docketNumber}`;

  const mappingUpdateRequests = updatedUserCases.map(userCaseItem =>
    client.put({
      Item: {
        ...userCaseItem,
        gsi1pk,
      },
      applicationContext,
    }),
  );

  return mappingUpdateRequests;
};

/**
 * updateCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseToUpdate the case data to update
 * @returns {Promise} the promise of the persistence calls
 */
exports.updateCase = async ({ applicationContext, caseToUpdate, oldCase }) => {
  const requests = [];

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
        ':pk': `case|${caseToUpdate.docketNumber}`,
        ':prefix': 'work-item',
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      applicationContext,
    });

    const updateWorkItemRecords = (updatedCase, previousCase, workItemId) => {
      const workItemRequests = [];
      if (previousCase.status !== updatedCase.status) {
        workItemRequests.push(
          updateWorkItemCaseStatus({
            applicationContext,
            caseStatus: updatedCase.status,
            workItemId,
          }),
        );
      }
      if (previousCase.caseCaption !== updatedCase.caseCaption) {
        workItemRequests.push(
          updateWorkItemCaseTitle({
            applicationContext,
            caseTitle: Case.getCaseTitle(updatedCase.caseCaption),
            workItemId,
          }),
        );
      }
      if (previousCase.docketNumberSuffix !== updatedCase.docketNumberSuffix) {
        workItemRequests.push(
          updateWorkItemDocketNumberSuffix({
            applicationContext,
            docketNumberSuffix: updatedCase.docketNumberSuffix || null,
            workItemId,
          }),
        );
      }
      if (previousCase.trialDate !== updatedCase.trialDate) {
        workItemRequests.push(
          updateWorkItemTrialDate({
            applicationContext,
            trialDate: updatedCase.trialDate || null,
            workItemId,
          }),
        );
      }
      if (previousCase.associatedJudge !== updatedCase.associatedJudge) {
        workItemRequests.push(
          updateWorkItemAssociatedJudge({
            applicationContext,
            associatedJudge: updatedCase.associatedJudge,
            workItemId,
          }),
        );
      }
      if (previousCase.inProgress !== updatedCase.inProgress) {
        workItemRequests.push(
          updateWorkItemCaseIsInProgress({
            applicationContext,
            caseIsInProgress: updatedCase.inProgress,
            workItemId,
          }),
        );
      }
      return workItemRequests;
    };

    for (let mapping of workItemMappings) {
      const [, workItemId] = mapping.sk.split('|');
      requests.push(
        ...updateWorkItemRecords(caseToUpdate, oldCase, workItemId),
      );
    }
  }

  if (
    oldCase.status !== caseToUpdate.status ||
    oldCase.caseCaption !== caseToUpdate.caseCaption ||
    oldCase.docketNumberSuffix !== caseToUpdate.docketNumberSuffix
  ) {
    const messageMappings = await client.query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${caseToUpdate.docketNumber}`,
        ':prefix': 'message',
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      applicationContext,
    });

    messageMappings.forEach(message => {
      if (oldCase.status !== caseToUpdate.status) {
        message.caseStatus = caseToUpdate.status;
      }
      if (oldCase.caseCaption !== caseToUpdate.caseCaption) {
        message.caseTitle = Case.getCaseTitle(caseToUpdate.caseCaption);
      }
      if (oldCase.docketNumberSuffix !== caseToUpdate.docketNumberSuffix) {
        message.docketNumberSuffix = caseToUpdate.docketNumberSuffix;
      }
      requests.push(
        updateMessage({
          applicationContext,
          message,
        }),
      );
    });
  }

  if (oldCase.associatedJudge !== caseToUpdate.associatedJudge) {
    const deadlines = await getCaseDeadlinesByDocketNumber({
      applicationContext,
      docketNumber: caseToUpdate.docketNumber,
    });
    const updatedDeadlineRequests = deadlines.map(caseDeadline => {
      caseDeadline.associatedJudge = caseToUpdate.associatedJudge;
      return createCaseDeadline({
        applicationContext,
        caseDeadline,
      });
    });
    requests.push(...updatedDeadlineRequests);
  }

  // update user-case mappings
  if (
    oldCase.status !== caseToUpdate.status ||
    oldCase.docketNumberSuffix !== caseToUpdate.docketNumberSuffix ||
    oldCase.caseCaption !== caseToUpdate.caseCaption ||
    oldCase.leadDocketNumber !== caseToUpdate.leadDocketNumber
  ) {
    const userCaseMappings = await client.query({
      ExpressionAttributeNames: {
        '#gsi1pk': 'gsi1pk',
      },
      ExpressionAttributeValues: {
        ':gsi1pk': `user-case|${caseToUpdate.docketNumber}`,
      },
      IndexName: 'gsi1',
      KeyConditionExpression: '#gsi1pk = :gsi1pk',
      applicationContext,
    });

    requests.push(
      ...updateUserCaseMappings({
        applicationContext,
        caseToUpdate,
        userCaseMappings,
      }),
    );
  }

  const setLeadCase = caseToUpdate.leadDocketNumber
    ? { gsi1pk: `case|${caseToUpdate.leadDocketNumber}` }
    : {};

  await Promise.all([
    client.put({
      Item: {
        pk: `case|${caseToUpdate.docketNumber}`,
        sk: `case|${caseToUpdate.docketNumber}`,
        ...setLeadCase,
        ...omit(caseToUpdate, fieldsToOmitBeforePersisting),
      },
      applicationContext,
    }),
    ...requests,
  ]);

  return caseToUpdate;
};
