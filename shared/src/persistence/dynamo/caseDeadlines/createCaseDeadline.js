const client = require('../../dynamodbClientService');
const {
  createCaseDeadlineCatalogRecord,
} = require('./createCaseDeadlineCatalogRecord');
const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');

/**
 * createCaseDeadline
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseDeadline the case deadline data
 */
exports.createCaseDeadline = async ({ applicationContext, caseDeadline }) => {
  const { caseDeadlineId } = caseDeadline;
  console.log('caseDeadlineId', caseDeadlineId);
  console.log('caseDeadline', caseDeadline);
  await client.put({
    Item: {
      pk: `case-deadline|${caseDeadlineId}`,
      sk: `case-deadline|${caseDeadlineId}`,
      ...caseDeadline,
    },
    applicationContext,
  });

  await client.put({
    Item: {
      pk: `case|${caseDeadline.caseId}`,
      sk: `case-deadline|${caseDeadlineId}`,
    },
    applicationContext,
  });

  await createCaseDeadlineCatalogRecord({
    applicationContext,
    caseDeadlineId,
  });
};
