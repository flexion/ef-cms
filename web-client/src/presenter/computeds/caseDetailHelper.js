import { state } from 'cerebral';

export const caseDetailHelper = get => {
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const currentPage = get(state.currentPage);
  const directDocumentLinkDesired = [
    'CaseDetailPublic',
    'CaseDetailRespondent',
  ].includes(currentPage);

  return {
    showActionRequired: !caseDetail.payGovId,
    showCaptionEditButton: caseDetail.status !== 'Batched for IRS',
    showDirectDownloadLink: directDocumentLinkDesired,
    showDocumentDetailLink: !directDocumentLinkDesired,
    showDocumentStatus: !caseDetail.irsSendDate,
    showFileDocumentButton: [
      'CaseDetailRespondent',
      'CaseDetailPublic',
    ].includes(currentPage),
    showIrsServedDate: !!caseDetail.irsSendDate,
    showPayGovIdInput: form.paymentType == 'payGov',
    showPaymentOptions: !(caseDetail.payGovId && !form.paymentType),
    showPaymentRecord: caseDetail.payGovId && !form.paymentType,
    showPreferredTrialCity: caseDetail.preferredTrialCity,
    showRecallButton: caseDetail.status === 'Batched for IRS',
    showServeToIrsButton: ['New', 'Recalled'].includes(caseDetail.status),
  };
};
