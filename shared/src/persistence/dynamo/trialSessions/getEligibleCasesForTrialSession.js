const client = require('../../dynamodbClientService');

exports.getEligibleCasesForTrialSession = async ({
  applicationContext,
  limit,
  skPrefix,
}) => {
  const mappings = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': 'eligible-for-trial-case-catalog',
      ':prefix': skPrefix,
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    Limit: limit,
    applicationContext,
  });

  const caseIds = mappings.map(metadata => metadata.caseId);

  const results = await client.batchGet({
    applicationContext,
    keys: caseIds.map(caseId => ({
      pk: `case|${caseId}`,
      sk: `case|${caseId}`,
    })),
  });

  const afterMapping = caseIds.map(caseId => ({
    ...results.find(r => caseId === r.caseId),
  }));

  return afterMapping;
};
