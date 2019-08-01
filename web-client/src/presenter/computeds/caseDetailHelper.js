import { state } from 'cerebral';

export const caseDetailHelper = (get, applicationContext) => {
  const { Case } = applicationContext.getEntityConstructors();
  const caseDetail = get(state.caseDetail);
  const caseDeadlines = get(state.caseDeadlines) || [];
  const caseHasRespondent =
    !!caseDetail && !!caseDetail.respondents && !!caseDetail.respondents.length;
  const userRole = get(state.user.role);
  const showActionRequired = !caseDetail.payGovId && userRole === 'petitioner';
  const documentDetailTab =
    get(state.caseDetailPage.informationTab) || 'docketRecord';
  const form = get(state.form);
  const currentPage = get(state.currentPage);
  const directDocumentLinkDesired = ['CaseDetail'].includes(currentPage);
  const caseIsPaid = caseDetail.payGovId && !form.paymentType;
  const isExternalUser = ['practitioner', 'petitioner', 'respondent'].includes(
    userRole,
  );
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
  const pendingAssociation = get(state.screenMetadata.pendingAssociation);

  let showFileDocumentButton = ['CaseDetail'].includes(currentPage);
  let showAddDocketEntryButton =
    ['CaseDetailInternal'].includes(currentPage) && userRole === 'docketclerk';
  let showCreateOrderButton =
    ['CaseDetailInternal'].includes(currentPage) &&
    userRole === 'petitionsclerk';
  let showRequestAccessToCaseButton = false;
  let showPendingAccessToCaseButton = false;
  let showFileFirstDocumentButton = false;
  let showCaseDeadlinesExternal = false;
  let showCaseDeadlinesInternal = false;
  let showCaseDeadlinesInternalEmpty = false;
  let userHasAccessToCase = false;

  if (isExternalUser) {
    if (userAssociatedWithCase) {
      userHasAccessToCase = true;
      showFileDocumentButton = true;
      showRequestAccessToCaseButton = false;
      showPendingAccessToCaseButton = false;
      showFileFirstDocumentButton = false;

      if (caseDeadlines && caseDeadlines.length > 0) {
        showCaseDeadlinesExternal = true;
      }
    } else {
      showFileDocumentButton = false;
      if (userRole === 'practitioner') {
        showRequestAccessToCaseButton = !pendingAssociation;
        showPendingAccessToCaseButton = pendingAssociation;
      }
      if (userRole === 'respondent') {
        showFileFirstDocumentButton = !caseHasRespondent;
        showRequestAccessToCaseButton = caseHasRespondent;
      }
    }
  } else {
    userHasAccessToCase = true;

    if (caseDeadlines && caseDeadlines.length > 0) {
      showCaseDeadlinesInternal = true;
    } else {
      showCaseDeadlinesInternalEmpty = true;
    }
  }

  const showCaseNameForPrimary = !get(state.caseDetail.contactSecondary.name);

  return {
    caseCaptionPostfix: Case.CASE_CAPTION_POSTFIX,
    caseDeadlines,
    documentDetailTab,
    hidePublicCaseInformation: !isExternalUser,
    showActionRequired,
    showAddCounsel: !isExternalUser,
    showAddDocketEntryButton,
    showCaptionEditButton:
      caseDetail.status !== 'Batched for IRS' && !isExternalUser,
    showCaseDeadlinesExternal,
    showCaseDeadlinesInternal,
    showCaseDeadlinesInternalEmpty,
    showCaseInformationPublic: isExternalUser,
    showCaseNameForPrimary,
    showCreateOrderButton,
    showDirectDownloadLink: directDocumentLinkDesired,
    showDocumentDetailLink: !directDocumentLinkDesired,
    showDocumentStatus: !caseDetail.irsSendDate,
    showEditContactButton: isExternalUser,
    showEditSecondaryContactModal:
      get(state.showModal) === 'EditSecondaryContact',
    showFileDocumentButton,
    showFileFirstDocumentButton,
    showIrsServedDate: !!caseDetail.irsSendDate,
    showPayGovIdInput: form.paymentType == 'payGov',
    showPaymentOptions: !caseIsPaid,
    showPaymentRecord: caseIsPaid,
    showPendingAccessToCaseButton,
    showPractitionerSection:
      !isExternalUser ||
      (caseDetail.practitioners && !!caseDetail.practitioners.length),
    showPreferredTrialCity: caseDetail.preferredTrialCity,
    showRecallButton: caseDetail.status === 'Batched for IRS',
    showRequestAccessToCaseButton,
    showRespondentSection:
      !isExternalUser ||
      (caseDetail.respondents && !!caseDetail.respondents.length),
    showServeToIrsButton: ['New', 'Recalled'].includes(caseDetail.status),
    userHasAccessToCase,
  };
};
