const client = require('../../dynamodbClientService');

/**
 * setPriorityOnAllWorkItems
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to update work items for
 * @param {boolean} providers.highPriority true if the work items should be set high priority, false otherwise
 * @param {string} providers.trialDate the date of the trial or undefined
 * @returns {Promise} the promise of the persistence calls
 */
exports.setPriorityOnAllWorkItems = async ({
  applicationContext,
  caseId,
  highPriority,
  trialDate,
}) => {
  const workItemMappings = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `${caseId}|workItem`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  const requests = [];
  for (let mapping of workItemMappings) {
    requests.push(
      client.update({
        ExpressionAttributeNames: {
          '#highPriority': 'highPriority',
          '#trialDate': 'trialDate',
        },
        ExpressionAttributeValues: {
          ':highPriority': highPriority,
          ':trialDate': trialDate || null,
        },
        Key: {
          pk: mapping.pk,
          sk: mapping.sk,
        },
        UpdateExpression:
          'SET #highPriority = :highPriority, #trialDate = :trialDate',
        applicationContext,
      }),
    );
  }

  const [results] = await Promise.all(requests);

  return results;
};
