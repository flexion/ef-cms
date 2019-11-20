import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const SectionWorkQueueOutbox = connect(
  {
    documentEditLinkHelper: state.documentEditLinkHelper,
    formattedWorkQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
    workQueueSectionHelper: state.workQueueSectionHelper,
  },
  ({
    documentEditLinkHelper,
    formattedWorkQueue,
    workQueueHelper,
    workQueueSectionHelper,
  }) => {
    return (
      <React.Fragment>
        <table
          aria-describedby="tab-work-queue"
          className="usa-table work-queue subsection"
          id="section-work-queue"
        >
          <thead>
            <tr>
              <th aria-label="Docket Number" colSpan="2">
                <span className="padding-left-2px">Docket</span>
              </th>
              {workQueueHelper.showReceivedColumn && <th>Filed</th>}
              {workQueueHelper.showSentColumn && <th>Sent</th>}
              <th>Case name</th>
              <th aria-label="Status Icon" className="padding-right-0" />
              <th>Document</th>
              {!workQueueHelper.hideFiledByColumn && <th>Filed by</th>}
              {!workQueueHelper.hideCaseStatusColumn && <th>Case status</th>}
              {workQueueHelper.showMessagesSentFromColumn && <th>From</th>}
              {workQueueHelper.showAssignedToColumn && (
                <th>{workQueueHelper.assigneeColumnTitle}</th>
              )}
              {workQueueHelper.showProcessedByColumn && <th>QC’d by</th>}
              {workQueueHelper.showBatchedByColumn && <th>Batched by</th>}
              {!workQueueHelper.hideSectionColumn && <th>Section</th>}
              {workQueueHelper.showServedColumn && <th>Served</th>}
            </tr>
          </thead>
          {formattedWorkQueue.map((item, idx) => (
            <tbody key={idx}>
              <tr>
                <td aria-hidden="true" className="focus-toggle" />
                <td className="message-queue-row">
                  <CaseLink formattedCase={item} />
                </td>
                {workQueueHelper.showReceivedColumn && (
                  <td className="message-queue-row">
                    <span className="no-wrap">{item.received}</span>
                  </td>
                )}
                {workQueueHelper.showSentColumn && (
                  <td className="message-queue-row">
                    <span className="no-wrap">{item.sentDateFormatted}</span>
                  </td>
                )}
                <td className="message-queue-row message-queue-case-title">
                  {item.caseTitle}
                </td>
                <td className="message-queue-row has-icon padding-right-0">
                  {item.showBatchedStatusIcon && (
                    <FontAwesomeIcon
                      aria-hidden="true"
                      className="iconStatusBatched"
                      icon={['far', 'clock']}
                      size="lg"
                    />
                  )}
                </td>

                <td className="message-queue-row">
                  <div className="message-document-title">
                    <a
                      className="case-link"
                      href={documentEditLinkHelper({
                        docketNumber: item.docketNumber,
                        documentId: item.document.documentId,
                        messageId: item.currentMessage.messageId,
                      })}
                      onClick={e => {
                        e.stopPropagation();
                      }}
                    >
                      {item.document.documentTitle ||
                        item.document.documentType}
                    </a>
                  </div>
                  {workQueueHelper.showMessageContent && (
                    <div
                      className="message-document-detail"
                      id={`detail-${item.workItemId}`}
                    >
                      {item.completedMessage || item.currentMessage.message}
                    </div>
                  )}
                </td>
                {!workQueueHelper.hideFiledByColumn && (
                  <td className="message-queue-row">{item.document.filedBy}</td>
                )}
                {!workQueueHelper.hideCaseStatusColumn && (
                  <td className="message-queue-row">{item.caseStatus}</td>
                )}
                {workQueueHelper.showMessagesSentFromColumn && (
                  <td className="message-queue-row">
                    {item.currentMessage.from}
                  </td>
                )}
                {workQueueHelper.showAssignedToColumn && (
                  <td className="message-queue-row">
                    {item.currentMessage.to}
                  </td>
                )}
                {workQueueHelper.showProcessedByColumn && (
                  <td className="message-queue-row">{item.completedBy}</td>
                )}
                {workQueueHelper.showBatchedByColumn && (
                  <td className="message-queue-row">{item.completedBy}</td>
                )}
                {!workQueueHelper.hideSectionColumn && (
                  <td className="message-queue-row">
                    {workQueueSectionHelper.sectionDisplay(item.section)}
                  </td>
                )}
                {workQueueHelper.showServedColumn && (
                  <td className="message-queue-row">
                    {item.completedAtFormatted}
                  </td>
                )}
              </tr>
            </tbody>
          ))}
        </table>
        {formattedWorkQueue.length === 0 && (
          <p>{workQueueHelper.queueEmptyMessage}</p>
        )}
      </React.Fragment>
    );
  },
);
