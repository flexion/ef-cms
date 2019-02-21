import { state } from 'cerebral';

export default get => {
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const currentPage = get(state.currentPage);
  const directDocumentLinkDesired = [
    'CaseDetailPetitioner',
    'CaseDetailRespondent',
  ].includes(currentPage);

  const isRespondentView = ['CaseDetailRespondent'].includes(currentPage);

  const isPetitionerView = ['CaseDetailPetitioner'].includes(currentPage);

  return {
    showServeToIrsButton: ['New', 'Recalled'].includes(caseDetail.status),
    showRecallButton: caseDetail.status === 'Batched for IRS',
    showDocumentStatus: !caseDetail.irsSendDate,
    showDocketRecordActionColumn: isPetitionerView,
    showDirectDownloadLink: directDocumentLinkDesired,
    showDocumentDetailLink: !directDocumentLinkDesired,
    showFileDocumentButton: ['CaseDetailRespondent'].includes(currentPage),
    showIrsServedDate: !!caseDetail.irsSendDate,
    showPayGovIdInput: form.paymentType == 'payGov',
    showPaymentOptions: !(caseDetail.payGovId && !form.paymentType),
    showActionRequired: !caseDetail.payGovId,
    showPaymentRecord: caseDetail.payGovId && !form.paymentType,
    showPreferredTrialCity: !isRespondentView && caseDetail.preferredTrialCity,
  };
};
