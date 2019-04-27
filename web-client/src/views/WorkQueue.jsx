import { If } from '../ustc-ui/If/If';
import { IndividualWorkQueue } from './IndividualWorkQueue';
import { SectionWorkQueue } from './SectionWorkQueue';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const WorkQueue = connect(
  {
    chooseWorkQueueSequence: sequences.chooseWorkQueueSequence,
    runBatchProcessSequence: sequences.runBatchProcessSequence,
    refreshTokenSequence: sequences.refreshTokenSequence,
    unreadCount: state.notifications.unreadCount,
  },
  ({ chooseWorkQueueSequence, unreadCount, runBatchProcessSequence, refreshTokenSequence}) => {
    return (
      <React.Fragment>
        <div>
          <h1 tabIndex="-1" id="work-queue-title">
            Work Queue
          </h1>
          <span className="unread">{unreadCount}</span>
        </div>
        <Tabs
          className="classic-horizontal"
          defaultActiveTab="my"
          bind="workQueueToDisplay.queue"
          onSelect={() =>
            chooseWorkQueueSequence({
              box: 'inbox',
            })
          }
        >
          <Tab tabName="my" title="My Queue" id="tab-my-queue">
            <div id="tab-individual-panel">
              <IndividualWorkQueue />
            </div>
          </Tab>
          <Tab tabName="section" title="Section Queue" id="tab-work-queue">
            <div id="tab-section-panel">
              <SectionWorkQueue />
            </div>
          </Tab>
          <If bind="workQueueHelper.showStartCaseButton">
            <div className="fix-top-right">
              <a
                className="usa-button align-right"
                href="/start-a-case"
                id="init-file-petition"
              >
                Create a Case
              </a>
            </div>
          </If>
        </Tabs>
        <If bind="workQueueHelper.showRunBatchIRSProcessButton">
          <button
            className="usa-button-secondary"
            onClick={() => refreshTokenSequence()}
          >
            Run IRS Batch Process
          </button>
        </If>
      </React.Fragment>
    );
  },
);
