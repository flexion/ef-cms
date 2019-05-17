import { DocketRecordHeader } from './DocketRecordHeader';
import { DocketRecordOverlay } from './DocketRecordOverlay';
import { FilingsAndProceedings } from './FilingsAndProceedings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';

export const DocketRecord = connect(
  {
    caseDetail: state.formattedCaseDetail,
    clearDocumentSequence: sequences.clearDocumentSequence,
    helper: state.caseDetailHelper,
    refreshCaseSequence: sequences.refreshCaseSequence,
    showModal: state.showModal,
  },
  ({ caseDetail, helper, refreshCaseSequence, showModal }) => {
    useEffect(() => {
      const interval = setInterval(() => {
        refreshCaseSequence();
      }, 30 * 1000);

      return () => {
        clearInterval(interval);
      };
    }, []);

    return (
      <React.Fragment>
        <DocketRecordHeader />

        <table
          className="usa-table docket-record responsive-table row-border-only"
          aria-label="docket record"
        >
          <thead>
            <tr>
              <th className="center-column" aria-label="Number">
                No.
              </th>
              <th>Date</th>
              <th className="center-column">Event</th>
              <th className="icon-column" aria-hidden="true" />
              <th>Filings and Proceedings</th>
              <th>Filed By</th>
              <th>Action</th>
              <th>Served</th>
              <th className="center-column">Parties</th>
            </tr>
          </thead>
          <tbody>
            {caseDetail.docketRecordWithDocument.map(
              ({ record, document, index }, arrayIndex) => (
                <tr key={index}>
                  <td className="center-column hide-on-mobile">{index}</td>
                  <td>
                    <span className="no-wrap">{record.createdAtFormatted}</span>
                  </td>
                  <td className="center-column hide-on-mobile">
                    {document && document.eventCode}
                  </td>
                  <td
                    className="filing-type-icon hide-on-mobile"
                    aria-hidden="true"
                  >
                    {document && document.isPaper && (
                      <FontAwesomeIcon icon={['fas', 'file-alt']} />
                    )}
                    {document &&
                      helper.showDirectDownloadLink &&
                      document.processingStatus !== 'complete' && (
                        <FontAwesomeIcon
                          icon="spinner"
                          className="fa-spin spinner"
                        />
                      )}
                  </td>
                  <td>
                    <FilingsAndProceedings
                      record={record}
                      document={document}
                      arrayIndex={arrayIndex}
                    />
                  </td>
                  <td className="hide-on-mobile">
                    {document && document.filedBy}
                  </td>
                  <td className="hide-on-mobile">{record.action}</td>
                  <td>
                    {document && document.isStatusServed && (
                      <span>{caseDetail.datePetitionSentToIrsMessage}</span>
                    )}
                    {document && helper.showDocumentStatus && (
                      <span>{document.status}</span>
                    )}
                  </td>
                  <td className="center-column hide-on-mobile">
                    <span className="responsive-label">Parties</span>
                    {record.servedParties}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        {showModal == 'DocketRecordOverlay' && <DocketRecordOverlay />}
      </React.Fragment>
    );
  },
);
