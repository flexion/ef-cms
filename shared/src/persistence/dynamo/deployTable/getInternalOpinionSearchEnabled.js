const client = require('../../dynamodbClientService');

/**
 * getInternalOpinionSearchEnabled
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<string>} the value of the internal-opinion-search-enabled flag on the dynamodb deploy table
 */
exports.getInternalOpinionSearchEnabled = async ({ applicationContext }) => {
  const result = await client.getFromDeployTable({
    Key: {
      pk: 'internal-opinion-search-enabled',
      sk: 'internal-opinion-search-enabled',
    },
    applicationContext,
  });

  return result.current;
};
