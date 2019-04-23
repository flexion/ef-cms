const { Case } = require('../entities/Case');

/**
 * validateCaseDetail
 * @param applicationContext
 * @param caseInitiator
 * @param user
 * @param fileHasUploaded
 * @returns {Promise<{petitionFileId}>}
 */
exports.validateCaseDetail = ({ applicationContext, caseDetail }) => {
  return new Case({
    applicationContext,
    rawCase: caseDetail,
  }).getFormattedValidationErrors();
};
