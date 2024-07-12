import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { getDocumentTypesForSelect } from './internalTypesHelper';
import { getFilerParties } from './getFilerParties';
import { showGenerationType } from '@web-client/presenter/actions/setDefaultGenerationTypeAction';
import { state } from '@web-client/presenter/app.cerebral';

export const caseAssociationRequestHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  certificateOfServiceDateFormatted: string;
  documentWithAttachments: boolean;
  documentWithObjections: boolean;
  documentWithSupportingDocuments: boolean;
  documents: {
    documentTitleTemplate: string;
    documentType: string;
    eventCode: string;
    scenario: string;
  }[];
  documentsForSelect: {
    documentTitleTemplate: string;
    documentType: string;
    eventCode: string;
    scenario: string;
    label: string;
    value: string;
  }[];
  isAutoGeneratedEntryOfAppearance: boolean;
  representingPartiesNames: string[];
  showFilingIncludes: boolean;
  showGenerationTypeForm: boolean;
  showFilingNotIncludes: boolean;
  showPartiesRepresenting: boolean;
  showPrimaryDocumentValid: boolean;
  showSecondaryParty: boolean;
} => {
  const { GENERATION_TYPES, PARTY_TYPES, USER_ROLES } =
    applicationContext.getConstants();

  const user = get(state.user);

  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const documentType = get(state.form.documentType);

  const showSecondaryParty =
    caseDetail.partyType === PARTY_TYPES.petitionerSpouse ||
    caseDetail.partyType === PARTY_TYPES.petitionerDeceasedSpouse;

  const { certificateOfServiceDate } = form;
  let certificateOfServiceDateFormatted: string = '';
  if (certificateOfServiceDate) {
    certificateOfServiceDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(certificateOfServiceDate, 'MMDDYY');
  }

  const documents: {
    documentTitleTemplate: string;
    documentType: string;
    eventCode: string;
    scenario: string;
  }[] = [
    {
      documentTitleTemplate: 'Entry of Appearance for [Petitioner Names]',
      documentType: 'Entry of Appearance',
      eventCode: 'EA',
      scenario: 'Standard',
    },
    {
      documentTitleTemplate: 'Substitution of Counsel for [Petitioner Names]',
      documentType: 'Substitution of Counsel',
      eventCode: 'SOC',
      scenario: 'Standard',
    },
  ];

  if (user.role === USER_ROLES.privatePractitioner) {
    documents.push(
      {
        documentTitleTemplate:
          'Limited Entry of Appearance for [Petitioner Names]',
        documentType: 'Limited Entry of Appearance',
        eventCode: 'LEA',
        scenario: 'Standard',
      },
      {
        documentTitleTemplate:
          'Motion to Substitute Parties and Change Caption',
        documentType: 'Motion to Substitute Parties and Change Caption',
        eventCode: 'M107',
        scenario: 'Standard',
      },
      {
        documentTitleTemplate: 'Notice of Intervention',
        documentType: 'Notice of Intervention',
        eventCode: 'NOI',
        scenario: 'Standard',
      },
      {
        documentTitleTemplate: 'Notice of Election to Participate',
        documentType: 'Notice of Election to Participate',
        eventCode: 'NOEP',
        scenario: 'Standard',
      },
      {
        documentTitleTemplate: 'Notice of Election to Intervene',
        documentType: 'Notice of Election to Intervene',
        eventCode: 'NOEI',
        scenario: 'Standard',
      },
    );
  }

  const documentsForSelect = getDocumentTypesForSelect(documents);

  const documentWithAttachments = [
    'Motion to Substitute Parties and Change Caption',
    'Notice of Intervention',
    'Notice of Election to Participate',
    'Notice of Election to Intervene',
  ].includes(documentType);

  const documentWithObjections = [
    'Substitution of Counsel',
    'Motion to Substitute Parties and Change Caption',
  ].includes(documentType);

  const documentWithSupportingDocuments = [
    'Motion to Substitute Parties and Change Caption',
  ].includes(documentType);

  const showFilingIncludes =
    form.certificateOfService || (documentWithAttachments && form.attachments);

  const showFilingNotIncludes =
    !form.certificateOfService ||
    (documentWithAttachments && !form.attachments) ||
    (documentWithSupportingDocuments && !form.hasSupportingDocuments);

  const showPartiesRepresenting = user.role === USER_ROLES.privatePractitioner;

  const representingPartiesNames = getFilerParties({
    caseDetail,
    filersMap: form.filersMap,
  });

  const isAutoGeneratedEntryOfAppearance =
    form.eventCode === 'EA' && form.generationType === GENERATION_TYPES.AUTO;

  const showGenerationTypeForm = showGenerationType(
    user,
    form.eventCode,
    caseDetail.petitioners,
  );

  return {
    certificateOfServiceDateFormatted,
    documentWithAttachments,
    documentWithObjections,
    documentWithSupportingDocuments,
    documents,
    documentsForSelect,
    isAutoGeneratedEntryOfAppearance,
    representingPartiesNames,
    showFilingIncludes,
    showFilingNotIncludes,
    showGenerationTypeForm,
    showPartiesRepresenting,
    showPrimaryDocumentValid: !!form.primaryDocumentFile,
    showSecondaryParty,
  };
};
