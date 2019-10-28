import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const IndividualWorkQueueInbox = connect(
  {
    documentHelper: state.documentHelper,
    formattedWorkQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
  },
  ({ documentHelper, formattedWorkQueue, workQueueHelper }) => {
    return (
      <React.Fragment>
        <table
          aria-describedby="tab-my-queue"
          className="usa-table work-queue subsection"
          id="my-work-queue"
        >
          <thead>
            <tr>
              <th aria-label="Docket Number" className="small" colSpan="2">
                <span className="padding-left-2px">Docket</span>
              </th>
              <th className="small">Filed</th>
              <th>Case name</th>
              <th aria-label="Status Icon" className="padding-right-0">
                &nbsp;
              </th>
              <th>Document</th>
              {!workQueueHelper.hideFiledByColumn && <th>Filed by</th>}
              <th>Case status</th>
              {!workQueueHelper.hideFromColumn && <th>From</th>}
              {!workQueueHelper.hideSectionColumn && (
                <th className="max-width-7">Section</th>
              )}
            </tr>
          </thead>
          {formattedWorkQueue.map((item, idx) => {
            return (
              <tbody key={idx}>
                <tr>
                  <td aria-hidden="true" className="focus-toggle" />
                  <td className="message-queue-row small">
                    <CaseLink formattedCase={item} />
                  </td>
                  <td className="message-queue-row small">
                    <span className="no-wrap">{item.received}</span>
                  </td>
                  <td className="message-queue-row message-queue-case-title">
                    {item.caseTitle}
                  </td>
                  <td className="message-queue-row has-icon padding-right-0">
                    {item.showBatchedStatusIcon && (
                      <FontAwesomeIcon
                        aria-hidden="false"
                        aria-label="batched for IRS"
                        className="iconStatusBatched"
                        icon={['far', 'clock']}
                        size="lg"
                      />
                    )}
                    {item.showRecalledStatusIcon && (
                      <FontAwesomeIcon
                        aria-hidden="false"
                        aria-label="recalled from IRS"
                        className="iconStatusRecalled"
                        icon={['far', 'clock']}
                        size="lg"
                      />
                    )}
                    {item.showUnreadStatusIcon && (
                      <FontAwesomeIcon
                        aria-hidden="false"
                        aria-label="unread message"
                        className="iconStatusUnread"
                        icon={['fas', 'envelope']}
                        size="lg"
                      />
                    )}
                  </td>
                  <td className="message-queue-row message-queue-document">
                    <div className="message-document-title">
                      <a
                        className={
                          item.isRead ? 'case-link' : 'link case-link-bold'
                        }
                        href={documentHelper({
                          docketNumber: item.docketNumber,
                          documentId: item.document.documentId,
                          messageId: item.currentMessage.messageId,
                          shouldLinkToComplete:
                            item.document.isFileAttached === false,
                          shouldLinkToEdit:
                            workQueueHelper.showEditDocketEntry &&
                            item.isQC &&
                            item.document.eventCode !== 'P',
                          workItemIdToMarkAsRead: !item.isRead
                            ? item.workItemId
                            : null,
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
                        {item.currentMessage.message}
                      </div>
                    )}
                  </td>
                  {!workQueueHelper.hideFiledByColumn && (
                    <td className="message-queue-row">
                      {item.document.filedBy}
                    </td>
                  )}
                  <td className="message-queue-row">{item.caseStatus}</td>
                  {!workQueueHelper.hideFromColumn && (
                    <td className="message-queue-row from">
                      {item.currentMessage.from}
                    </td>
                  )}
                  {!workQueueHelper.hideSectionColumn && (
                    <td className="message-queue-row max-width-7">
                      {item.sentBySection}
                    </td>
                  )}
                </tr>
              </tbody>
            );
          })}
        </table>
        {formattedWorkQueue.length === 0 && (
          <p>{workQueueHelper.queueEmptyMessage}</p>
        )}
      </React.Fragment>
    );
  },
);
