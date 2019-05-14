import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SectionWorkQueueInbox = connect(
  {
    assignSelectedWorkItemsSequence: sequences.assignSelectedWorkItemsSequence,
    documentHelper: state.documentHelper,
    sectionWorkQueue: state.formattedWorkQueue,
    selectAssigneeSequence: sequences.selectAssigneeSequence,
    selectWorkItemSequence: sequences.selectWorkItemSequence,
    selectedWorkItems: state.selectedWorkItems,
    setFocusedWorkItem: sequences.setFocusedWorkItemSequence,
    users: state.users,
    workQueueHelper: state.workQueueHelper,
  },
  ({
    assignSelectedWorkItemsSequence,
    documentHelper,
    sectionWorkQueue,
    selectAssigneeSequence,
    selectedWorkItems,
    selectWorkItemSequence,
    setFocusedWorkItem,
    users,
    workQueueHelper,
  }) => {
    return (
      <React.Fragment>
        {workQueueHelper.showSendToBar && (
          <div className="action-section">
            <span
              className="assign-work-item-count"
              aria-label="selected work items count"
            >
              <FontAwesomeIcon icon="check" />
              {selectedWorkItems.length}
            </span>
            <select
              aria-label="select a assignee"
              className="usa-select"
              onChange={event => {
                selectAssigneeSequence({
                  assigneeId: event.target.value,
                  assigneeName:
                    event.target.options[event.target.selectedIndex].text,
                });
                assignSelectedWorkItemsSequence();
              }}
              name="options"
              id="options"
            >
              <option value>Assign to...</option>
              {users.map(user => (
                <option key={user.userId} value={user.userId}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <table
          className="usa-table work-queue subsection"
          id="section-work-queue"
          aria-describedby="tab-work-queue"
        >
          <thead>
            <tr>
              <th colSpan="3">Select</th>
              <th aria-label="Docket Number">Docket</th>
              <th>Received</th>
              <th>Document</th>
              <th>Status</th>
              <th>To</th>
              <th>From</th>
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
                    className="focus-button usa-button usa-button--unstyled"
                    aria-label="Expand message detail"
                    aria-expanded={item.isFocused}
                    aria-controls={`detail-${item.workItemId}`}
                  />{' '}
                </td>
                <td className="has-icon">
                  <input
                    id={item.workItemId}
                    type="checkbox"
                    className="usa-checkbox__input"
                    onChange={e => {
                      selectWorkItemSequence({
                        workItem: item,
                      });
                      e.stopPropagation();
                    }}
                    checked={item.selected}
                    aria-label="Select work item"
                  />
                  <label
                    htmlFor={item.workItemId}
                    id={`label-${item.workItemId}`}
                    className="usa-checkbox__label padding-top-05"
                  />
                </td>
                <td className="section-queue-row has-icon">
                  {item.showBatchedStatusIcon && (
                    <FontAwesomeIcon
                      icon={['far', 'clock']}
                      className={item.statusIcon}
                      aria-hidden="true"
                    />
                  )}
                </td>
                <td className="section-queue-row">
                  {item.docketNumberWithSuffix}
                </td>
                <td className="section-queue-row">
                  {item.currentMessage.createdAtFormatted}
                </td>
                <td className="section-queue-row">
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
                <td className="section-queue-row">{item.caseStatus}</td>
                <td className="to section-queue-row">{item.assigneeName}</td>
                <td className="section-queue-row">
                  {item.currentMessage.from}
                </td>
                <td className="section-queue-row">{item.sentBySection}</td>
              </tr>
              {item.isFocused && (
                <tr className="queue-focus queue-message">
                  <td className="focus-toggle">
                    <button
                      className="focus-button usa-button usa-button--unstyled"
                      tabIndex="-1"
                      aria-disabled="true"
                    />
                  </td>
                  <td colSpan="4" aria-hidden="true" />
                  <td
                    colSpan="5"
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
      </React.Fragment>
    );
  },
);
