const { get } = require('../../dynamodbClientService');

/**
 * getUserMappingByConsolidatedCases
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.consolidatedCases the consolidated cases
 * @returns {Promise} the promise of the call to persistence
 */
exports.getUserMappingByConsolidatedCases = async ({
  applicationContext,
  consolidatedCases,
}) => {
  const { userId } = applicationContext.getCurrentUser();

  const items = await Promise.all(
    consolidatedCases.map(consolidatedCase => {
      const { caseId } = consolidatedCase;

      return get({
        Key: {
          pk: `${userId}|case`,
          sk: caseId,
        },
        applicationContext,
      });
    }),
  );

  return items;
};
