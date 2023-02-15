const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

/**
 * getDynamoEndpoints
 *
 * @param {object} providers the providers object
 * @param {object} providers.fallbackRegion the region to fallback to
 * @param {object} providers.fallbackRegionEndpoint the endpoint of the fallback region
 * @param {object} providers.mainRegion the main region in use
 * @param {object} providers.mainRegionEndpoint the main region endpoint in use
 * @param {object} providers.masterDynamoDbEndpoint the master dynamo db endpoint in use
 * @param {object} providers.masterRegion the master region
 * @param {object} providers.useMasterRegion the flag indicating whether or not to use the master region
 * @returns {Object} the main region database and the fallback region database values
 */
exports.getDynamoEndpoints = ({
  fallbackRegion,
  fallbackRegionEndpoint,
  mainRegion,
  mainRegionEndpoint,
  masterDynamoDbEndpoint,
  masterRegion,
  useMasterRegion,
}) => {
  const baseConfig = {
    httpOptions: {
      timeout: 5000,
    },
    maxRetries: 3,
  };

  const mainRegionDBClient = new DynamoDB({
    ...baseConfig,
    endpoint: useMasterRegion ? masterDynamoDbEndpoint : mainRegionEndpoint,
    region: useMasterRegion ? masterRegion : mainRegion,
  });
  const mainRegionDB = DynamoDBDocumentClient.from(mainRegionDBClient);

  const fallbackRegionDBClient = new DynamoDB({
    ...baseConfig,
    endpoint: useMasterRegion ? fallbackRegionEndpoint : masterDynamoDbEndpoint,
    region: useMasterRegion ? fallbackRegion : masterRegion,
  });
  const fallbackRegionDB = DynamoDBDocumentClient.from(fallbackRegionDBClient);

  return { fallbackRegionDB, mainRegionDB };
};
