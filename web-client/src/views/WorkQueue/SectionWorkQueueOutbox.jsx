import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const SectionWorkQueueOutbox = connect(
  {
    formattedWorkQueue: state.formattedWorkQueue,
    workQueueHelper: state.workQueueHelper,
  },
  function SectionWorkQueueOutbox({ formattedWorkQueue, workQueueHelper }) {
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
                <span className="padding-left-2px">Docket No.</span>
              </th>
              <th>Case title</th>
              <th>Document</th>
              <th>Processed By</th>
              {!workQueueHelper.hideFiledByColumn && <th>Filed By</th>}
              {!workQueueHelper.hideCaseStatusColumn && <th>Case Status</th>}
              {workQueueHelper.showAssignedToColumn && <th>Assigned To</th>}
              {workQueueHelper.showProcessedByColumn && <th>QC’d By</th>}
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
                <td className="message-queue-row message-queue-case-title">
                  {item.caseTitle}
                </td>
                <td className="message-queue-row">
                  <div className="message-document-title">
                    <a
                      className="case-link"
                      href={item.editLink}
                      onClick={e => {
                        e.stopPropagation();
                      }}
                    >
                      {item.document.documentTitle ||
                        item.document.documentType}
                    </a>
                  </div>
                </td>
                <td className="message-queue-row">{item.completedBy}</td>
                {!workQueueHelper.hideFiledByColumn && (
                  <td className="message-queue-row">{item.document.filedBy}</td>
                )}
                {!workQueueHelper.hideCaseStatusColumn && (
                  <td className="message-queue-row">{item.caseStatus}</td>
                )}
                {workQueueHelper.showAssignedToColumn && (
                  <td className="message-queue-row">
                    {item.currentMessage.to}
                  </td>
                )}
                {workQueueHelper.showProcessedByColumn && (
                  <td className="message-queue-row">{item.completedBy}</td>
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
        {formattedWorkQueue.length === 0 && <p>There are no documents.</p>}
      </React.Fragment>
    );
  },
);
