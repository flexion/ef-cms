import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const IndividualWorkQueueInProgress = connect(
  {
    documentHelper: state.documentHelper,
    workQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
  },
  ({ documentHelper, workQueue, workQueueHelper }) => {
    return (
      <React.Fragment>
        <table
          aria-describedby="tab-my-queue"
          className="usa-table work-queue subsection"
          id="my-work-queue"
        >
          <thead>
            <tr>
              <th aria-label="Docket Number" colSpan="2">
                <span className="padding-left-2px">Docket</span>
              </th>
              <th>Filed</th>
              <th aria-label="Status Icon" className="padding-right-0">
                &nbsp;
              </th>
              <th>Document</th>
              {!workQueueHelper.hideFiledByColumn && <th>Filed By</th>}
              <th>Case Status</th>
              {!workQueueHelper.hideFromColumn && <th>From</th>}
              {!workQueueHelper.hideSectionColumn && <th>Section</th>}
            </tr>
          </thead>
          {workQueue.map((item, idx) => {
            return (
              <tbody key={idx}>
                <tr>
                  <td className="focus-toggle">
                    <button
                      aria-controls={`detail-${item.workItemId}`}
                      aria-expanded={item.isFocused}
                      aria-label="Expand message detail"
                      className="focus-button usa-button usa-button--unstyled"
                    />{' '}
                  </td>
                  <td className="message-queue-row">
                    <span className="no-wrap">
                      {item.docketNumberWithSuffix}
                    </span>
                  </td>
                  <td className="message-queue-row">
                    <span className="no-wrap">{item.received}</span>
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
                          shouldLinkToEdit: true,
                          workItemIdToMarkAsRead: !item.isRead
                            ? item.workItemId
                            : null,
                        })}
                        onClick={e => {
                          e.stopPropagation();
                        }}
                      >
                        {item.document.documentType}
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
                    <td className="message-queue-row">{item.sentBySection}</td>
                  )}
                </tr>
              </tbody>
            );
          })}
        </table>
      </React.Fragment>
    );
  },
);
