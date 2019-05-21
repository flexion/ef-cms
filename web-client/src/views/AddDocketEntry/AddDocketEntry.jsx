import { CaseDetailHeader } from '../CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
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
    caseDetail: state.caseDetail,
    screenMetadata: state.screenMetadata,
    showModal: state.showModal,
    submitDocketEntrySequence: sequences.submitDocketEntrySequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  ({
    caseDetail,
    submitDocketEntrySequence,
    updateScreenMetadataSequence,
    screenMetadata,
    showModal,
  }) => {
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
                updateScreenMetadataSequence({
                  key: 'supportingDocument',
                  value: false,
                });
                submitDocketEntrySequence();
              }}
            >
              Finish
            </button>
            <button
              type="button"
              id="save-and-add-supporting"
              className="usa-button-secondary"
              onClick={() => {
                updateScreenMetadataSequence({
                  key: 'supportingDocument',
                  value: true,
                });
                submitDocketEntrySequence();
              }}
            >
              {screenMetadata.supporting &&
                'Add Another Supporting Document(s)'}
              {!screenMetadata.supporting && 'Add Supporting Document(s)'}
            </button>
            <a
              href={`/case-detail/${caseDetail.docketNumber}`}
              id="cancel-button"
            >
              Cancel
            </a>
          </div>
        </section>

        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal confirmSequence={submitDocketEntrySequence} />
        )}
      </React.Fragment>
    );
  },
);
