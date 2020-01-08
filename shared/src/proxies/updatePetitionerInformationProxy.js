const { put } = require('./requests');

/**
 * updatePetitionerInformationInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {string} providers.contactPrimary the primary contact information to update
 * @param {string} providers.contactSecondary the secondary contact information to update
 * @returns {Promise<*>} the promise of the api call
 */
exports.updatePetitionerInformationInteractor = ({
  applicationContext,
  caseId,
  contactPrimary,
  contactSecondary,
}) => {
  return put({
    applicationContext,
    body: { contactPrimary, contactSecondary },
    endpoint: `/cases/${caseId}/petitioner-info`,
  });
};
