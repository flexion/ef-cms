const client = require('../../dynamodbClientService');

/**
 * verifyPendingCaseForUser
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to verify
 * @param {string} providers.userId the id of the user to verify
 * @returns {object} the case if it was verified, null otherwise
 */
exports.verifyPendingCaseForUser = async ({
  applicationContext,
  docketNumber,
  userId,
}) => {
  const myCase = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `user|${userId}`,
      ':sk': `pending-case|${docketNumber}`,
    },
    KeyConditionExpression: '#pk = :pk AND #sk = :sk',
    applicationContext,
  });

  return myCase && myCase.length > 0;
};
