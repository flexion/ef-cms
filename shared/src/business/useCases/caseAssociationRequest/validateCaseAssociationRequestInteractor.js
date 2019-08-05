/**
 * validateCaseAssociationRequestInteractor
 * @param applicationContext
 * @param caseAssociationRequest
 * @returns {object}
 */
exports.validateCaseAssociationRequestInteractor = ({
  applicationContext,
  caseAssociationRequest,
}) => {
  const errors = applicationContext
    .getEntityConstructors()
    .CaseAssociationRequestFactory(caseAssociationRequest)
    .getFormattedValidationErrors();
  return errors || null;
};
