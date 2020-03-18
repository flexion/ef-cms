const { get } = require('../requests');

/**
 * getUserCaseNoteForCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array<string>} providers.caseIds the case ids to get notes for
 * @returns {Promise<*>} the promise of the api call
 */
exports.getUserCaseNoteForCasesInteractor = ({
  applicationContext,
  caseIds,
}) => {
  return get({
    applicationContext,
    endpoint: `/case-notes/batch-cases/${caseIds.join(',')}/user-notes`,
  });
};
