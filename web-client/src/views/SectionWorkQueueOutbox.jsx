import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SectionWorkQueueOutbox = connect(
  {
    documentHelper: state.documentHelper,
    sectionWorkQueue: state.formattedWorkQueue,
    setFocusedWorkItem: sequences.setFocusedWorkItemSequence,
    workQueueSectionHelper: state.workQueueSectionHelper,
  },
  ({
    documentHelper,
    sectionWorkQueue,
    setFocusedWorkItem,
    workQueueSectionHelper,
  }) => {
    return (
      <table
        className="usa-table work-queue subsection"
        id="section-work-queue"
        aria-describedby="tab-work-queue"
      >
        <thead>
          <tr>
            <th colSpan="2" aria-hidden="true">
              &nbsp;
            </th>
            <th aria-label="Docket Number">Docket</th>
            <th>Sent</th>
            <th>Document</th>
            <th>Status</th>
            <th>From</th>
            <th>To</th>
            <th>Section</th>
          </tr>
        </thead>
        {sectionWorkQueue.map((item, idx) => (
          <tbody
            key={idx}
            onClick={() =>
              setFocusedWorkItem({
                queueType: 'workQueue',
                uiKey: item.uiKey,
              })
            }
          >
            <tr>
              <td className="focus-toggle">
                <button
                  className="focus-button"
                  aria-label="Expand message detail"
                  aria-expanded={item.isFocused}
                  aria-controls={`detail-${item.workItemId}`}
                />
              </td>
              <td className="has-icon">
                {item.showBatchedStatusIcon && (
                  <FontAwesomeIcon
                    icon={['far', 'clock']}
                    className={item.statusIcon}
                    aria-hidden="true"
                  />
                )}
              </td>
              <td>{item.docketNumberWithSuffix}</td>
              <td>{item.sentDateFormatted}</td>
              <td>
                <a
                  onClick={e => {
                    e.stopPropagation();
                  }}
                  href={documentHelper({
                    docketNumber: item.docketNumber,
                    documentId: item.document.documentId,
                  })}
                  className="case-link"
                >
                  {item.document.documentType}
                </a>
              </td>
              <td>{item.caseStatus}</td>
              <td>{item.currentMessage.from}</td>
              <td>{item.assigneeName}</td>
              <td>{workQueueSectionHelper.sectionDisplay(item.section)}</td>
            </tr>
            {item.isFocused && (
              <tr className="queue-focus queue-message">
                <td className="focus-toggle">
                  <button
                    className="focus-button"
                    tabIndex="-1"
                    aria-disabled="true"
                  />
                </td>
                <td colSpan="3" aria-hidden="true" />
                <td
                  colSpan="4"
                  className="message-detail"
                  aria-label="Message detail"
                  aria-live="polite"
                  id={`detail-${item.workItemId}`}
                >
                  {item.currentMessage.message}
                </td>
              </tr>
            )}
          </tbody>
        ))}
      </table>
    );
  },
);
