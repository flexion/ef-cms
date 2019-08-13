import { SectionWorkQueueBatched } from './SectionWorkQueueBatched';
import { SectionWorkQueueInProgress } from './SectionWorkQueueInProgress';
import { SectionWorkQueueInbox } from './SectionWorkQueueInbox';
import { SectionWorkQueueOutbox } from './SectionWorkQueueOutbox';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { WorkQueueActionButtons } from './WorkQueueActionButtons';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SectionWorkQueue = connect(
  {
    navigateToPathSequence: sequences.navigateToPathSequence,
    queue: state.workQueueToDisplay.queue,
    workQueueHelper: state.workQueueHelper,
  },
  ({ navigateToPathSequence, queue, workQueueHelper }) => {
    return (
      <Tabs
        bind="workQueueToDisplay.box"
        className="classic-horizontal-header3 tab-border"
        onSelect={box => {
          navigateToPathSequence({
            path: workQueueHelper.getQueuePath({
              box,
              queue,
            }),
          });
        }}
      >
        <WorkQueueActionButtons />

        <Tab id="section-inbox-tab" tabName="inbox" title="Inbox">
          <div id="section-inbox-tab-content">
            <SectionWorkQueueInbox />
          </div>
        </Tab>
        {workQueueHelper.showInProgresssTab && (
          <Tab
            id="section-in-progress-tab"
            tabName="inProgress"
            title="In Progress"
          >
            <div id="section-in-progress-tab-content">
              <SectionWorkQueueInProgress />
            </div>
          </Tab>
        )}
        {workQueueHelper.showBatchedForIRSTab && (
          <Tab
            id="section-batched-for-irs-tab"
            tabName="batched"
            title="Batched for IRS"
          >
            <div id="section-batched-for-irs-tab-content">
              <SectionWorkQueueBatched />
            </div>
          </Tab>
        )}
        {workQueueHelper.showSectionSentTab && (
          <Tab
            id="section-sent-tab"
            tabName="outbox"
            title={workQueueHelper.sentTitle}
          >
            <div id="section-sent-tab-content">
              <SectionWorkQueueOutbox />
            </div>
          </Tab>
        )}
      </Tabs>
    );
  },
);
