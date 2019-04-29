/**
 * generateDocumentTitle
 *
 * @param applicationContext
 * @param caseAssociationRequest
 * @param contactPrimaryName
 * @param contactSecondaryName
 * @returns {string} document title
 */
exports.generateCaseAssociationDocumentTitle = ({
  applicationContext,
  caseAssociationRequest,
  contactPrimaryName,
  contactSecondaryName,
}) => {
  const caseAssociation = applicationContext
    .getEntityConstructors()
    .CaseAssociationRequest(caseAssociationRequest);
  return caseAssociation.getDocumentTitle(
    contactPrimaryName,
    contactSecondaryName,
  );
};
