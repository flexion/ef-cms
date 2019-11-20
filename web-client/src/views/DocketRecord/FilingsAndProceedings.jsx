import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const FilingsAndProceedings = connect(
  {
    arrayIndex: props.arrayIndex,
    baseUrl: state.baseUrl,
    caseDetailHelper: state.caseDetailHelper,
    docketRecordHelper: state.docketRecordHelper,
    document: props.document,
    documentEditLinkHelper: state.documentEditLinkHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    record: props.record,
    showDocketRecordDetailModalSequence:
      sequences.showDocketRecordDetailModalSequence,
    token: state.token,
  },
  ({
    arrayIndex,
    baseUrl,
    caseDetailHelper,
    docketRecordHelper,
    document,
    documentEditLinkHelper,
    formattedCaseDetail,
    record,
    showDocketRecordDetailModalSequence,
    token,
  }) => {
    const renderDocumentLink = (
      documentId,
      description,
      isPaper,
      docketRecordIndex = 0,
    ) => {
      return (
        <React.Fragment>
          {caseDetailHelper.userHasAccessToCase && !document.isInProgress && (
            <React.Fragment>
              <NonMobile>
                <a
                  aria-label={`View PDF: ${description}`}
                  href={`${baseUrl}/documents/${documentId}/document-download-url?token=${token}`}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {isPaper && (
                    <span className="filing-type-icon-mobile">
                      <FontAwesomeIcon icon={['fas', 'file-alt']} />
                    </span>
                  )}
                  {description}
                </a>
              </NonMobile>
              <Mobile>
                <Button
                  link
                  aria-roledescription="button to view document details"
                  className="padding-0 border-0"
                  onClick={() => {
                    showDocketRecordDetailModalSequence({
                      docketRecordIndex,
                      showModal: 'DocketRecordOverlay',
                    });
                  }}
                >
                  {description}
                </Button>
              </Mobile>
            </React.Fragment>
          )}
          {(!caseDetailHelper.userHasAccessToCase || document.isInProgress) &&
            description}
        </React.Fragment>
      );
    };

    return (
      <React.Fragment>
        {document &&
          docketRecordHelper.showDirectDownloadLink &&
          document.processingStatus === 'complete' &&
          renderDocumentLink(
            document.documentId,
            record.description,
            document.isPaper,
            arrayIndex,
          )}

        {document &&
          docketRecordHelper.showDirectDownloadLink &&
          document.processingStatus !== 'complete' && (
            <React.Fragment>
              {caseDetailHelper.showDocketRecordInProgressState && (
                <span
                  aria-label="document uploading marker"
                  className="usa-tag"
                >
                  <span aria-hidden="true">Processing</span>
                </span>
              )}
              {record.description}
            </React.Fragment>
          )}

        {document &&
          docketRecordHelper.showDocumentDetailLink &&
          (!document.isNotServedCourtIssuedDocument ||
            (document.isNotServedCourtIssuedDocument &&
              docketRecordHelper.canShowEditDocketEntryLink)) && (
            <a
              aria-label="View PDF"
              href={documentEditLinkHelper({
                docketNumber: formattedCaseDetail.docketNumber,
                documentId: document.documentId,
                shouldLinkToComplete: document.isFileAttached === false,
                shouldLinkToEdit:
                  docketRecordHelper.showEditDocketEntry && document.canEdit,
                shouldLinkToEditCourtIssued:
                  docketRecordHelper.showEditDocketEntry &&
                  document.isCourtIssuedDocument,
                shouldLinkedToDetails: !!document.servedAt,
              })}
            >
              {document && document.isPaper && (
                <span className="filing-type-icon-mobile">
                  <FontAwesomeIcon icon={['fas', 'file-alt']} />
                </span>
              )}
              {document.documentTitle || record.description}
            </a>
          )}

        {document &&
          document.isNotServedCourtIssuedDocument &&
          !docketRecordHelper.canShowEditDocketEntryLink &&
          (document.documentTitle || record.description)}

        <span> {record.signatory}</span>

        {!document && record.description}

        <span className="filings-and-proceedings">
          {document &&
            document.documentTitle &&
            document.additionalInfo &&
            ` ${document.additionalInfo}`}
          {record.filingsAndProceedings && ` ${record.filingsAndProceedings}`}
          {document &&
            document.additionalInfo2 &&
            ` ${document.additionalInfo2}`}
        </span>
      </React.Fragment>
    );
  },
);
