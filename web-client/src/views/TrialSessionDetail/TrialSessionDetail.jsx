import { AllCases } from './AllCases';
import { Button } from '../../ustc-ui/Button/Button';
import { EligibleCases } from './EligibleCases';
import { ErrorNotification } from '../ErrorNotification';
import { InactiveCases } from './InactiveCases';
import { OpenCases } from './OpenCases';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { TrialSessionDetailHeader } from './TrialSessionDetailHeader';
import { TrialSessionInformation } from './TrialSessionInformation';
import { WarningNotification } from '../WarningNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const TrialSessionDetail = connect(
  {
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
    setTrialSessionCalendarSequence: sequences.setTrialSessionCalendarSequence,
  },
  ({ formattedTrialSessionDetails, setTrialSessionCalendarSequence }) => (
    <>
      <TrialSessionDetailHeader />

      <section className="usa-section grid-container">
        <SuccessNotification />
        <ErrorNotification />
        <WarningNotification />
        <TrialSessionInformation />
        {!formattedTrialSessionDetails.isCalendared && (
          <Tabs
            bind="trialSessionDetailsTab.caseList"
            defaultActiveTab="EligibleCases"
          >
            <Button
              className="tab-right-button ustc-ui-tabs ustc-ui-tabs--right-button-container"
              icon="calendar-check"
              onClick={() => setTrialSessionCalendarSequence()}
            >
              Set Calendar
            </Button>
            <Tab
              id="eligible-cases-tab"
              tabName="EligibleCases"
              title="Eligible Cases"
            >
              <div id="eligible-cases-tab-content">
                <EligibleCases />
              </div>
            </Tab>
          </Tabs>
        )}
        {formattedTrialSessionDetails.isCalendared && (
          <Tabs
            bind="trialSessionDetailsTab.calendaredCaseList"
            defaultActiveTab="OpenCases"
          >
            <Tab id="open-cases-tab" tabName="OpenCases" title="Open Cases">
              <div id="open-cases-tab-content">
                <OpenCases />
              </div>
            </Tab>
            <Tab
              id="inactive-cases-tab"
              tabName="InactiveCases"
              title="Inactive Cases"
            >
              <div id="inactive-cases-tab-content">
                <InactiveCases />
              </div>
            </Tab>
            <Tab id="all-cases-tab" tabName="AllCases" title="All Cases">
              <div id="all-cases-tab-content">
                <AllCases />
              </div>
            </Tab>
          </Tabs>
        )}
      </section>
    </>
  ),
);
