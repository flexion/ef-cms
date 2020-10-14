import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SectionWorkQueueInProgress = connect(
  {
    assignSelectedWorkItemsSequence: sequences.assignSelectedWorkItemsSequence,
    formattedWorkQueue: state.formattedWorkQueue,
    selectAssigneeSequence: sequences.selectAssigneeSequence,
    selectWorkItemSequence: sequences.selectWorkItemSequence,
    selectedWorkItems: state.selectedWorkItems,
    users: state.users,
    workQueueHelper: state.workQueueHelper,
  },
  function SectionWorkQueueInProgress({
    assignSelectedWorkItemsSequence,
    formattedWorkQueue,
    selectAssigneeSequence,
    selectedWorkItems,
    selectWorkItemSequence,
    users,
    workQueueHelper,
  }) {
    return (
      <React.Fragment>
        {workQueueHelper.showSendToBar && (
          <div className="action-section">
            <span className="assign-work-item-count">
              <Icon aria-label="selected work items count" icon="check" />
              {selectedWorkItems.length}
            </span>
            <select
              aria-label="select a assignee"
              className="usa-select"
              id="options"
              name="options"
              onChange={event => {
                selectAssigneeSequence({
                  assigneeId: event.target.value,
                  assigneeName:
                    event.target.options[event.target.selectedIndex].text,
                });
                assignSelectedWorkItemsSequence();
              }}
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
          aria-describedby="tab-work-queue"
          className="usa-table work-queue subsection"
          id="section-work-queue"
        >
          <thead>
            <tr>
              {workQueueHelper.showSelectColumn && <th colSpan="2">&nbsp;</th>}
              <th aria-label="Docket Number">Docket No.</th>
              <th>Filed</th>
              <th>Case Title</th>
              <th>Document</th>
              {!workQueueHelper.hideFiledByColumn && <th>Filed By</th>}
              <th>Case Status</th>
              {workQueueHelper.showAssignedToColumn && <th>Assigned To</th>}
            </tr>
          </thead>
          {formattedWorkQueue.map((item, idx) => (
            <tbody key={idx}>
              <tr>
                {workQueueHelper.showSelectColumn && (
                  <>
                    <td aria-hidden="true" className="focus-toggle" />
                    <td className="message-select-control">
                      <input
                        aria-label="Select work item"
                        checked={item.selected}
                        className="usa-checkbox__input"
                        id={item.workItemId}
                        type="checkbox"
                        onChange={() => {
                          selectWorkItemSequence({
                            workItem: item,
                          });
                        }}
                      />
                      <label
                        className="usa-checkbox__label padding-top-05"
                        htmlFor={item.workItemId}
                        id={`label-${item.workItemId}`}
                      />
                    </td>
                  </>
                )}
                <td className="message-queue-row">
                  <CaseLink formattedCase={item} />
                </td>
                <td className="message-queue-row">
                  <span className="no-wrap">{item.received}</span>
                </td>
                <td className="message-queue-row message-queue-case-title">
                  {item.caseTitle}
                </td>
                <td className="message-queue-row message-queue-document">
                  <div className="message-document-title">
                    <a className="case-link" href={item.editLink}>
                      {item.docketEntry.documentTitle ||
                        item.docketEntry.documentType}
                    </a>
                  </div>
                </td>
                {!workQueueHelper.hideFiledByColumn && (
                  <td className="message-queue-row">
                    {item.docketEntry.filedBy}
                  </td>
                )}
                <td className="message-queue-row">{item.caseStatus}</td>
                {workQueueHelper.showAssignedToColumn && (
                  <td className="to message-queue-row">{item.assigneeName}</td>
                )}
              </tr>
            </tbody>
          ))}
        </table>
        {formattedWorkQueue.length === 0 && <p>There are no documents.</p>}
      </React.Fragment>
    );
  },
);
