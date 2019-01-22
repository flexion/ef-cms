const {
  getRecordsViaMapping,
  stripInternalKeys,
  stripWorkItems,
} = require('../../awsDynamoPersistence');

exports.getCasesByUser = async ({ userId, applicationContext }) => {
  const cases = await getRecordsViaMapping({
    applicationContext,
    key: userId,
    type: 'case',
    isVersioned: true,
  });

  return applicationContext.filterCaseMetadata({
    cases: stripWorkItems(
      stripInternalKeys(cases),
      applicationContext.isAuthorizedForWorkItems(),
    ),
    applicationContext,
  });
};
