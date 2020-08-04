const { put } = require('../../dynamodbClientService');

/**
 * createCaseTrialSortMappingRecords
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number to create the trial sort mapping records for
 * @param {object} providers.caseSortTags the hybrid and nonHybrid sort tags
 */
exports.createCaseTrialSortMappingRecords = async ({
  applicationContext,
  caseSortTags,
  docketNumber,
}) => {
  const { hybrid, nonHybrid } = caseSortTags;

  await put({
    Item: {
      docketNumber,
      gsi1pk: `eligible-for-trial-case-catalog|${docketNumber}`,
      pk: 'eligible-for-trial-case-catalog',
      sk: nonHybrid,
    },
    applicationContext,
  });

  await put({
    Item: {
      docketNumber,
      gsi1pk: `eligible-for-trial-case-catalog|${docketNumber}`,
      pk: 'eligible-for-trial-case-catalog',
      sk: hybrid,
    },
    applicationContext,
  });
};
