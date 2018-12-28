import { connect } from '@cerebral/react';
import React from 'react';
import { state, sequences } from 'cerebral';

export default connect(
  {
    assignSelectedWorkItemsSequence: sequences.assignSelectedWorkItemsSequence,
    sectionWorkQueue: state.formattedSectionWorkQueue,
    selectAssigneeSequence: sequences.selectAssigneeSequence,
    selectedWorkItems: state.selectedWorkItems,
    selectWorkItemSequence: sequences.selectWorkItemSequence,
    switchWorkQueueSequence: sequences.switchWorkQueueSequence,
    users: state.users,
    workQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
  },
  function WorkQueue({
    assignSelectedWorkItemsSequence,
    sectionWorkQueue,
    selectAssigneeSequence,
    selectedWorkItems,
    selectWorkItemSequence,
    switchWorkQueueSequence,
    users,
    workQueue,
    workQueueHelper,
  }) {
    return (
      <React.Fragment>
        <h1 tabIndex="-1">Work Queue</h1>
        <div className="horizontal-tabs subsection">
          <ul role="tablist">
            <li
              className={
                workQueueHelper.showIndividualWorkQueue ? 'active' : ''
              }
            >
              <button
                role="tab"
                className="tab-link"
                id="tab-my-queue"
                aria-selected={workQueueHelper.showIndividualWorkQueue}
                onClick={() =>
                  switchWorkQueueSequence({
                    workQueueToDisplay: 'individual',
                  })
                }
              >
                <h2>My Queue</h2>
              </button>
            </li>
            <li
              className={workQueueHelper.showSectionWorkQueue ? 'active' : ''}
            >
              <button
                role="tab"
                className="tab-link"
                id="tab-work-queue"
                aria-selected={workQueueHelper.showSectionWorkQueue}
                onClick={() =>
                  switchWorkQueueSequence({
                    workQueueToDisplay: 'section',
                  })
                }
              >
                <h2>Section Queue</h2>
              </button>
            </li>
          </ul>
        </div>
        <div className="work-queue-tab-container">
          <h3 className="work-queue-tab">Inbox</h3>
        </div>
        {workQueueHelper.showSectionWorkQueue && (
          <table className="work-queue" id="section-work-queue" role="tabpanel">
            <thead>
              <tr>
                <th>Select</th>
                <th aria-label="Docket Number">Docket</th>
                <th>Received</th>
                <th>Document</th>
                <th>Status</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {workQueueHelper.showSendToBar && (
                <tr>
                  <td colSpan="8" className="action-bar">
                    <span className="selected-count">
                      {selectedWorkItems.length} selected
                    </span>
                    <label htmlFor="options">Send to</label>
                    <select
                      onChange={event =>
                        selectAssigneeSequence({
                          assigneeId: event.target.value,
                          assigneeName:
                            event.target.options[event.target.selectedIndex]
                              .text,
                        })
                      }
                      name="options"
                      id="options"
                    >
                      <option value>- Select -</option>
                      {users.map(user => (
                        <option key={user.userId} value={user.userId}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => assignSelectedWorkItemsSequence()}
                      className="usa-button"
                    >
                      Send
                    </button>
                  </td>
                </tr>
              )}
              {sectionWorkQueue.map(item => (
                <tr key={item.workItemId}>
                  <td>
                    <input
                      id={item.workItemId}
                      type="checkbox"
                      onChange={() =>
                        selectWorkItemSequence({
                          workItem: item,
                        })
                      }
                      checked={item.selected}
                    />
                    <label htmlFor={item.workItemId} />
                  </td>
                  <td>{item.docketNumber}</td>
                  <td>{item.messages[0].createdAtFormatted}</td>
                  <td>
                    <a
                      href={`/case-detail/${item.docketNumber}/documents/${
                        item.document.documentId
                      }`}
                      className="case-link"
                    >
                      {item.document.documentType}
                    </a>
                  </td>
                  <td>{item.caseStatus}</td>
                  <td>{item.messages[0].sentBy}</td>
                  <td>{item.assigneeName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {workQueueHelper.showIndividualWorkQueue && (
          <table className="work-queue" id="my-work-queue" role="tabpanel">
            <thead>
              <tr>
                <th aria-label="Docket Number">Docket</th>
                <th>Received</th>
                <th>Document</th>
                <th>Status</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {workQueue.map(item => (
                <tr key={item.workItemId}>
                  <td>{item.docketNumber}</td>
                  <td>{item.messages[0].createdAtFormatted}</td>
                  <td>
                    <a
                      href={`/case-detail/${item.docketNumber}/documents/${
                        item.document.documentId
                      }`}
                      className="case-link"
                    >
                      {item.document.documentType}
                    </a>
                  </td>
                  <td>{item.caseStatus}</td>
                  <td>{item.messages[0].sentBy}</td>
                  <td>{item.assigneeName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </React.Fragment>
    );
  },
);
