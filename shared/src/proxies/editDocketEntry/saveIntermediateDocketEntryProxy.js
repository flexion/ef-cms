const { put } = require('../requests');

/**
 * saveIntermediateDocketEntryInteractorProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.entryMetadata the entry metadata
 * @returns {Promise<*>} the promise of the api call
 */
exports.saveIntermediateDocketEntryInteractor = ({
  applicationContext,
  entryMetadata,
}) => {
  const { caseId } = entryMetadata;
  return put({
    applicationContext,
    body: {
      entryMetadata,
    },
    endpoint: `/case-documents/${caseId}/docket-entry-in-progress`,
  });
};
