import { state } from 'cerebral';
import { showContactsHelper } from '../computeds/showContactsHelper';

export const caseDetailEditHelper = get => {
  const { PARTY_TYPES } = get(state.constants);
  const partyType = get(state.caseDetail.partyType);
  const documents = get(state.caseDetail.documents);

  const showContacts = showContactsHelper(partyType, PARTY_TYPES);

  let showOwnershipDisclosureStatement = false;
  let ownershipDisclosureStatementDocumentId;

  if (
    [
      PARTY_TYPES.partnershipAsTaxMattersPartner,
      PARTY_TYPES.partnershipOtherThanTaxMatters,
      PARTY_TYPES.partnershipBBA,
      PARTY_TYPES.corporation,
    ].includes(partyType) &&
    documents
  ) {
    const odsDocs = documents.filter(document => {
      return document.documentType === 'Ownership Disclosure Statement';
    });
    if (odsDocs[0]) {
      showOwnershipDisclosureStatement = true;
      ownershipDisclosureStatementDocumentId = odsDocs[0].documentId;
    }
  }

  return {
    partyTypes: PARTY_TYPES,

    showPrimaryContact: showContacts.contactPrimary,
    showSecondaryContact: showContacts.contactSecondary,

    showOwnershipDisclosureStatement,
    ownershipDisclosureStatementDocumentId,
  };
};
