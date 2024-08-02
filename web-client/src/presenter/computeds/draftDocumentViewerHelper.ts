/* eslint-disable complexity */

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { STATUS_REPORT_ORDER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const draftDocumentViewerHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  // Get constants and details from state
  const {
    EVENT_CODES_REQUIRING_SIGNATURE,
    GENERIC_ORDER_EVENT_CODE,
    NOTICE_EVENT_CODES,
    STIPULATED_DECISION_EVENT_CODE,
  } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();
  const permissions = get(state.permissions);
  const caseDetail = get(state.caseDetail);

  // Get the document from which the following business logic is derived
  // TODO consistently rename variable below
  const viewerDraftDocumentToDisplayDocketEntryId = get(
    state.viewerDraftDocumentToDisplay.docketEntryId,
  );

  const formattedCaseDetail = applicationContext
    .getUtilities()
    .getFormattedCaseDetail({
      applicationContext,
      caseDetail,
    });

  const formattedDocumentToDisplay =
    viewerDraftDocumentToDisplayDocketEntryId &&
    formattedCaseDetail.draftDocuments &&
    formattedCaseDetail.draftDocuments.find(
      draftDocument =>
        draftDocument.docketEntryId ===
        viewerDraftDocumentToDisplayDocketEntryId,
    );

  if (!formattedDocumentToDisplay) {
    return {
      createdByLabel: '',
      documentTitle: '',
    };
  }

  // Business logic
  const documentRequiresSignature = EVENT_CODES_REQUIRING_SIGNATURE.includes(
    formattedDocumentToDisplay.eventCode,
  );

  const isNotice = NOTICE_EVENT_CODES.includes(
    formattedDocumentToDisplay.eventCode,
  );

  const isStipulatedDecision =
    formattedDocumentToDisplay.eventCode === STIPULATED_DECISION_EVENT_CODE;

  const documentIsSigned = !!formattedDocumentToDisplay.signedAt;

  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  const hasDocketEntryPermission = permissions.CREATE_ORDER_DOCKET_ENTRY;

  const showEditButtonForRole = isInternalUser;

  const showApplyRemoveSignatureButtonForRole = isInternalUser;

  const isDraftStampOrder =
    formattedDocumentToDisplay.eventCode === GENERIC_ORDER_EVENT_CODE &&
    formattedDocumentToDisplay.stampData?.disposition;

  const isStatusReportOrder = Object.values(
    STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions,
  ).includes(formattedDocumentToDisplay?.draftOrderState?.orderType);

  // begin draft document-specific variables
  const createdByLabel = formattedDocumentToDisplay.filedBy
    ? `Created by ${formattedDocumentToDisplay.filedBy}`
    : '';
  const showAddDocketEntryButtonForRole = hasDocketEntryPermission;
  // end draft document-specific variables

  // Derive button state
  const showEditButtonSigned = isStatusReportOrder
    ? permissions.STATUS_REPORT_ORDER && documentIsSigned
    : showEditButtonForRole &&
      documentIsSigned &&
      !isNotice &&
      !isStipulatedDecision &&
      !isDraftStampOrder;

  const showEditButtonNotSigned = isStatusReportOrder
    ? permissions.STATUS_REPORT_ORDER && !documentIsSigned
    : showEditButtonForRole && (!documentIsSigned || isNotice);

  // TODO: rename this variable to match messageDocumentHelper.ts
  const showAddDocketEntryButtonForDocument =
    documentIsSigned || !documentRequiresSignature;

  const showAddDocketEntryButton =
    showAddDocketEntryButtonForRole && showAddDocketEntryButtonForDocument;

  const showApplySignatureButtonForDocument = !documentIsSigned;

  const showApplySignatureButton =
    showApplyRemoveSignatureButtonForRole &&
    showApplySignatureButtonForDocument;

  const showRemoveSignatureButtonForDocument =
    documentIsSigned && !isNotice && !isStipulatedDecision;

  const showRemoveSignatureButton =
    showApplyRemoveSignatureButtonForRole &&
    showRemoveSignatureButtonForDocument &&
    !isDraftStampOrder;

  const showDocumentNotSignedAlert =
    documentRequiresSignature && !documentIsSigned;

  // Links definition
  const addDocketEntryLink = `/case-detail/${caseDetail.docketNumber}/documents/${viewerDraftDocumentToDisplayDocketEntryId}/add-court-issued-docket-entry`;
  // TODO: rename applySignatureLink so that its name corresponds to whatever the final name of the applySignatureLink is in messageDocumentHelper.ts
  const applySignatureLink = `/case-detail/${caseDetail.docketNumber}/edit-order/${viewerDraftDocumentToDisplayDocketEntryId}/sign`;

  return {
    addDocketEntryLink,
    applySignatureLink,
    createdByLabel,
    documentTitle: formattedDocumentToDisplay.documentTitle,
    showAddDocketEntryButton,
    showApplySignatureButton,
    showDocumentNotSignedAlert,
    showEditButtonNotSigned,
    showEditButtonSigned,
    showRemoveSignatureButton,
  };
};
