const client = require('../../dynamodbClientService');

/**
 * getUserCaseNoteForCases
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array<string>} providers.caseIds the id of the case to get the case notes for
 * @param {string} providers.userId the id of the user to get the case notes for
 * @returns {Promise} the promise of the persistence call to get the record
 */
exports.getUserCaseNoteForCases = async ({
  applicationContext,
  caseIds,
  userId,
}) => {
  return client.batchGet({
    applicationContext,
    keys: caseIds.map(caseId => ({
      pk: `user-case-note|${caseId}`,
      sk: userId,
    })),
  });
};
