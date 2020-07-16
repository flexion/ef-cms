import { state } from 'cerebral';

export const formattedOpenCases = (get, applicationContext) => {
  const { formatCase } = applicationContext.getUtilities();

  const cases = get(state.openCases);
  return cases.map(myCase => formatCase(applicationContext, myCase));
};

export const formattedClosedCases = (get, applicationContext) => {
  const { formatCase } = applicationContext.getUtilities();

  const cases = get(state.closedCases);
  return cases.map(myCase => formatCase(applicationContext, myCase));
};

export const getShowDocumentViewerLink = ({
  hasDocument,
  isCourtIssuedDocument,
  isExternalUser,
  isServed,
  isStricken,
  isUnservable,
  userHasAccessToCase,
  userHasNoAccessToDocument,
}) => {
  if (!hasDocument) return false;

  if (isExternalUser) {
    if (isStricken) return false;
    if (userHasNoAccessToDocument) return false;

    if (isCourtIssuedDocument) {
      if (isUnservable) return true;
      if (!isServed) return false;
    } else {
      if (!userHasAccessToCase) return false;
      if (!isServed) return false;
    }
  }

  return true;
};

export const formattedCaseDetail = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(user.role);
  const permissions = get(state.permissions);
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
  const {
    DOCUMENT_PROCESSING_STATUS_OPTIONS,
    SYSTEM_GENERATED_DOCUMENT_TYPES,
    UNSERVABLE_EVENT_CODES,
  } = applicationContext.getConstants();
  const systemGeneratedEventCodes = Object.keys(
    SYSTEM_GENERATED_DOCUMENT_TYPES,
  ).map(key => {
    return SYSTEM_GENERATED_DOCUMENT_TYPES[key].eventCode;
  });

  const {
    formatCase,
    formatCaseDeadlines,
    sortDocketRecords,
  } = applicationContext.getUtilities();

  let docketRecordSort;
  const caseDetail = get(state.caseDetail);

  const caseDeadlines = get(state.caseDeadlines);
  const caseId = get(state.caseDetail.caseId);
  if (caseId) {
    docketRecordSort = get(state.sessionMetadata.docketRecordSort[caseId]);
  }

  const result = {
    ...applicationContext
      .getUtilities()
      .setServiceIndicatorsForCase(caseDetail),
    ...formatCase(applicationContext, caseDetail),
  };
  result.docketRecordWithDocument = sortDocketRecords(
    result.docketRecordWithDocument,
    docketRecordSort,
  );

  result.otherFilers = (result.otherFilers || []).map(otherFiler => ({
    ...otherFiler,
    showEAccessFlag: !isExternalUser && otherFiler.hasEAccess,
  }));

  result.otherPetitioners = (result.otherPetitioners || []).map(
    otherPetitioner => ({
      ...otherPetitioner,
      showEAccessFlag: !isExternalUser && otherPetitioner.hasEAccess,
    }),
  );

  result.contactPrimary = {
    ...result.contactPrimary,
    showEAccessFlag: !isExternalUser && result.contactPrimary.hasEAccess,
  };

  if (result.contactSecondary) {
    result.contactSecondary = {
      ...result.contactSecondary,
      showEAccessFlag: !isExternalUser && result.contactSecondary.hasEAccess,
    };
  }

  const getShowEditDocketRecordEntry = ({ document, userPermissions }) => {
    const hasSystemGeneratedDocument =
      document && systemGeneratedEventCodes.includes(document.eventCode);
    const hasCourtIssuedDocument = document && document.isCourtIssuedDocument;
    const hasServedCourtIssuedDocument =
      hasCourtIssuedDocument && !!document.servedAt;
    const hasUnservableCourtIssuedDocument =
      document && UNSERVABLE_EVENT_CODES.includes(document.eventCode);

    return (
      userPermissions.EDIT_DOCKET_ENTRY &&
      (!document || document.qcWorkItemsCompleted) &&
      !hasSystemGeneratedDocument &&
      (!hasCourtIssuedDocument ||
        hasServedCourtIssuedDocument ||
        hasUnservableCourtIssuedDocument)
    );
  };

  result.formattedDocketEntries = result.docketRecordWithDocument.map(
    ({ document, index, record }) => {
      const userHasAccessToCase = !isExternalUser || userAssociatedWithCase;
      const userHasAccessToDocument = record.isAvailableToUser;

      const formattedResult = {
        numberOfPages: 0,
        ...record,
        ...document,
        descriptionDisplay: record.description,
        index,
      };

      let showDocumentLinks = false;

      if (document) {
        if (!isExternalUser) {
          formattedResult.isInProgress =
            document.isInProgress || !document.servedAt;

          formattedResult.qcWorkItemsUntouched =
            !formattedResult.isInProgress &&
            document.qcWorkItemsUntouched &&
            !document.isCourtIssuedDocument;

          formattedResult.showLoadingIcon =
            !permissions.UPDATE_CASE &&
            document.processingStatus !==
              DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;
        }

        formattedResult.isPaper =
          !formattedResult.isInProgress &&
          !formattedResult.qcWorkItemsUntouched &&
          document.isPaper;

        if (document.documentTitle) {
          formattedResult.descriptionDisplay = document.documentTitle;
          if (document.additionalInfo) {
            formattedResult.descriptionDisplay += ` ${document.additionalInfo}`;
          }
        }

        formattedResult.showDocumentProcessing =
          !permissions.UPDATE_CASE &&
          document.processingStatus !==
            DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;

        formattedResult.isUnservable = UNSERVABLE_EVENT_CODES.includes(
          document.eventCode,
        );
        formattedResult.showNotServed =
          !formattedResult.isUnservable && document.isNotServedDocument;
        formattedResult.showServed = document.isStatusServed;

        showDocumentLinks = getShowDocumentViewerLink({
          hasDocument: !!document,
          isCourtIssuedDocument: document.isCourtIssuedDocument,
          isExternalUser,
          isServed: !!document.servedAt,
          isStricken: record.isStricken,
          isUnservable: formattedResult.isUnservable,
          userHasAccessToCase,
          userHasNoAccessToDocument: !userHasAccessToDocument,
        });

        formattedResult.showDocumentViewerLink =
          !isExternalUser && showDocumentLinks;

        formattedResult.showLinkToDocument =
          isExternalUser && showDocumentLinks;
      }

      formattedResult.filingsAndProceedingsWithAdditionalInfo = '';
      if (record.filingsAndProceedings) {
        formattedResult.filingsAndProceedingsWithAdditionalInfo += ` ${record.filingsAndProceedings}`;
      }
      if (document && document.additionalInfo2) {
        formattedResult.filingsAndProceedingsWithAdditionalInfo += ` ${document.additionalInfo2}`;
      }

      formattedResult.showEditDocketRecordEntry = getShowEditDocketRecordEntry({
        document,
        userPermissions: permissions,
      });

      formattedResult.showDocumentDescriptionWithoutLink = !showDocumentLinks;

      return formattedResult;
    },
  );

  result.formattedDraftDocuments = result.draftDocuments.map(draftDocument => {
    return {
      ...draftDocument,
      descriptionDisplay: draftDocument.documentTitle,
      showDocumentViewerLink: permissions.UPDATE_CASE,
    };
  });

  result.pendingItemsDocketEntries = result.formattedDocketEntries.filter(
    entry => entry.pending,
  );

  result.consolidatedCases = result.consolidatedCases || [];

  result.showBlockedTag = caseDetail.blocked || caseDetail.automaticBlocked;
  result.docketRecordSort = docketRecordSort;
  result.caseDeadlines = formatCaseDeadlines(applicationContext, caseDeadlines);
  return result;
};
