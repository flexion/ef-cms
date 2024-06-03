import { Button } from '../../ustc-ui/Button/Button';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { SortableColumn } from '../../ustc-ui/Table/SortableColumn';
import { TableFilters } from '../../ustc-ui/Table/TableFilters';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

export const MessagesIndividualInbox = connect(
  {
    constants: state.constants,
    formattedMessages: state.formattedMessages,
    messagesIndividualInboxHelper: state.messagesIndividualInboxHelper,
    screenMetadata: state.screenMetadata,
    setSelectedMessagesSequence: sequences.setSelectedMessagesSequence,
    sortTableSequence: sequences.sortTableSequence,
    tableSort: state.tableSort,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  function MessagesIndividualInbox({
    constants,
    formattedMessages,
    messagesIndividualInboxHelper,
    screenMetadata,
    setSelectedMessagesSequence,
    sortTableSequence,
    tableSort,
    updateScreenMetadataSequence,
  }) {
    const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!selectAllCheckboxRef.current) return;

      selectAllCheckboxRef.current.indeterminate =
        messagesIndividualInboxHelper.someMessagesSelected &&
        !messagesIndividualInboxHelper.allMessagesSelected;
    }, [
      selectAllCheckboxRef.current,
      messagesIndividualInboxHelper.someMessagesSelected,
      messagesIndividualInboxHelper.allMessagesSelected,
    ]);
    return (
      <>
        <div className="grid-row grid-gap margin-bottom-2">
          <div className="desktop:grid-col-8 tablet:grid-col-12 display-flex flex-align-center">
            <TableFilters
              filters={[
                {
                  isSelected: screenMetadata.caseStatus,
                  key: 'caseStatus',
                  label: 'Case Status',
                  options: formattedMessages.caseStatuses,
                },
                {
                  isSelected: screenMetadata.fromUser,
                  key: 'fromUser',
                  label: 'From',
                  options: formattedMessages.fromUsers,
                },
                {
                  isSelected: screenMetadata.fromSection,
                  key: 'fromSection',
                  label: 'Section',
                  options: formattedMessages.fromSections,
                },
              ]}
              onSelect={updateScreenMetadataSequence}
            ></TableFilters>
          </div>

          <div className="desktop:grid-col-4 tablet:grid-col-12 tablet:margin-top-2 text-right">
            <Button
              link
              className="action-button"
              data-testid="message-batch-mark-as-complete"
              disabled={
                // !messagesIndividualInboxHelper.isDownloadLinkEnabled
                true
              }
              icon="check-circle"
              id="button-batch-complete"
              // onClick={}
            >
              Complete
            </Button>
          </div>
        </div>

        <table className="usa-table ustc-table subsection">
          <thead>
            <tr>
              <th>
                <input
                  aria-label="all-messages-checkbox"
                  checked={messagesIndividualInboxHelper.allMessagesSelected}
                  data-testid="all-messages-checkbox"
                  id="all-messages-checkbox"
                  ref={selectAllCheckboxRef}
                  type="checkbox"
                  onChange={() => {
                    setSelectedMessagesSequence({
                      selectAll:
                        messagesIndividualInboxHelper.someMessagesSelected ||
                        !messagesIndividualInboxHelper.allMessagesSelected,
                    });
                  }}
                />
              </th>
              <th aria-hidden="true" className="consolidated-case-column"></th>
              <th aria-label="Docket Number" className="small" colSpan={2}>
                <SortableColumn
                  ascText={constants.CHRONOLOGICALLY_ASCENDING}
                  currentlySortedField={tableSort.sortField}
                  currentlySortedOrder={tableSort.sortOrder}
                  data-testid="message-individual-docket-number-header-button"
                  defaultSortOrder={constants.DESCENDING}
                  descText={constants.CHRONOLOGICALLY_DESCENDING}
                  hasRows={formattedMessages.hasMessages}
                  sortField="docketNumber"
                  title="Docket No."
                  onClickSequence={sortTableSequence}
                />
              </th>
              <th>
                <SortableColumn
                  ascText={constants.CHRONOLOGICALLY_ASCENDING}
                  currentlySortedField={tableSort.sortField}
                  currentlySortedOrder={tableSort.sortOrder}
                  data-testid="message-individual-received-header-button"
                  defaultSortOrder={constants.ASCENDING}
                  descText={constants.CHRONOLOGICALLY_DESCENDING}
                  hasRows={formattedMessages.hasMessages}
                  sortField="createdAt"
                  title="Received"
                  onClickSequence={sortTableSequence}
                />
              </th>
              <th className="message-unread-column"></th>
              <th>
                <SortableColumn
                  ascText={constants.ALPHABETICALLY_ASCENDING}
                  currentlySortedField={tableSort.sortField}
                  currentlySortedOrder={tableSort.sortOrder}
                  data-testid="message-individual-subject-header-button"
                  defaultSortOrder={constants.ASCENDING}
                  descText={constants.ALPHABETICALLY_DESCENDING}
                  hasRows={formattedMessages.hasMessages}
                  sortField="subject"
                  title="Message"
                  onClickSequence={sortTableSequence}
                />
              </th>
              <th>Case Title</th>
              <th>Case Status</th>
              <th>From</th>
              <th className="small">Section</th>
            </tr>
          </thead>
          {formattedMessages.messages.map(message => {
            return (
              <tbody key={message.messageId}>
                <tr key={message.messageId}>
                  <td>
                    <input
                      aria-label={`${message.caseTitle}-${message.subject}-checkbox`}
                      checked={message.isSelected}
                      id={`${message.caseTitle}-message-checkbox`}
                      type="checkbox"
                      onChange={() => {
                        setSelectedMessagesSequence({
                          messageId: message.messageId,
                        });
                      }}
                    />
                  </td>
                  <td className="consolidated-case-column">
                    <ConsolidatedCaseIcon
                      consolidatedIconTooltipText={
                        message.consolidatedIconTooltipText
                      }
                      inConsolidatedGroup={message.inConsolidatedGroup}
                      showLeadCaseIcon={message.isLeadCase}
                    />
                  </td>
                  <td
                    className="message-queue-row small"
                    colSpan={2}
                    data-testid="individual-message-inbox-docket-number-cell"
                  >
                    {message.docketNumberWithSuffix}
                  </td>
                  <td
                    className="message-queue-row small"
                    data-testid="individual-message-inbox-received-at-cell"
                  >
                    <span className="no-wrap">
                      {message.createdAtFormatted}
                    </span>
                  </td>
                  <td className="message-unread-column">
                    {!message.isRead && (
                      <Icon
                        aria-label="unread message"
                        className="fa-icon-blue"
                        icon="envelope"
                        size="1x"
                      />
                    )}
                  </td>
                  <td className="message-queue-row message-subject">
                    <div className="message-document-title">
                      <Button
                        link
                        className={classNames(
                          'padding-0',
                          message.isRead ? '' : 'text-bold',
                        )}
                        data-testid="individual-message-inbox-subject-cell"
                        href={message.messageDetailLink}
                      >
                        {message.subject}
                      </Button>
                    </div>

                    <div className="message-document-detail">
                      {message.message}
                    </div>
                  </td>
                  <td className="message-queue-row max-width-25">
                    {message.caseTitle}
                  </td>
                  <td className="message-queue-row">{message.caseStatus}</td>
                  <td className="message-queue-row from">{message.from}</td>
                  <td className="message-queue-row small">
                    {message.fromSectionFormatted}
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
        {!formattedMessages.hasMessages && <div>There are no messages.</div>}
      </>
    );
  },
);

MessagesIndividualInbox.displayName = 'MessagesIndividualInbox';
