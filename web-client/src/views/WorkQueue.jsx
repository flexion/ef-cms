import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

import IndividualWorkQueue from './IndividualWorkQueue';
import SectionWorkQueue from './SectionWorkQueue';
import { Tabs, Tab } from './Tabs';

export default connect(
  {
    chooseWorkQueueSequence: sequences.chooseWorkQueueSequence,
  },
  function WorkQueue({ chooseWorkQueueSequence }) {
    return (
      <React.Fragment>
        <h1 tabIndex="-1">Work Queue</h1>
        <Tabs
          defaultActiveTab="my"
          bind="workQueueToDisplay.queue"
          onSelect={() =>
            chooseWorkQueueSequence({
              box: 'inbox',
            })
          }
        >
          <Tab tabName="my" title="My Queue" id="tab-individual-panel">
            <IndividualWorkQueue />
          </Tab>
          <Tab tabName="section" title="Section Queue" id="tab-section-panel">
            <SectionWorkQueue />
          </Tab>
        </Tabs>
      </React.Fragment>
    );
  },
);
