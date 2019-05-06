import { CaseDetailHeader } from '../CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PrimaryDocumentForm } from './PrimaryDocumentForm';
import { SuccessNotification } from '../SuccessNotification';
import { SupportingDocumentForm } from './SupportingDocumentForm';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddDocketEntry = connect(
  {
    screenMetadata: state.screenMetadata,
    submitDocketEntrySequence: sequences.submitDocketEntrySequence,
  },
  ({ submitDocketEntrySequence, screenMetadata }) => {
    return (
      <React.Fragment>
        <div className="usa-grid breadcrumb">
          <FontAwesomeIcon icon="caret-left" />
          <a href="/" id="queue-nav">
            Back
          </a>
        </div>
        <section className="usa-section usa-grid DocumentDetail">
          <CaseDetailHeader />
          <hr aria-hidden="true" />

          <SuccessNotification />
          <ErrorNotification />

          <div className="usa-grid-full add-bottom-margin">
            <div className="usa-width-one-third">
              <Tabs
                asSwitch
                defaultActiveTab="PrimaryDocumentForm"
                bind="wizardStep"
              >
                <Tab tabName="PrimaryDocumentForm">
                  <PrimaryDocumentForm />
                </Tab>
                <Tab tabName="SupportingDocumentForm">
                  <SupportingDocumentForm />
                </Tab>
              </Tabs>
            </div>
            <div className="usa-width-two-thirds" />
          </div>

          <div className="button-box-container">
            <button
              id="save-and-finish"
              type="submit"
              className="usa-button"
              onClick={() => {
                submitDocketEntrySequence({
                  supportingDocument: false,
                });
              }}
            >
              Save and Finish
            </button>
            <button
              type="button"
              className="usa-button-secondary"
              onClick={() => {
                submitDocketEntrySequence({
                  supportingDocument: true,
                });
              }}
            >
              {screenMetadata.supporting &&
                'Save and Add Another Supporting Document'}
              {!screenMetadata.supporting &&
                'Save and Add Supporting Document(s)'}
            </button>
          </div>
        </section>
      </React.Fragment>
    );
  },
);
