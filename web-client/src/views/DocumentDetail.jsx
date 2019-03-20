import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { sequences, state } from 'cerebral';

import { CaseDetailEdit } from './CaseDetailEdit/CaseDetailEdit';
import { CaseDetailReadOnly } from './CaseDetailReadOnly';
import { CompletedMessages } from './DocumentDetail/CompletedMessages';
import { ErrorNotification } from './ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PendingMessages } from './DocumentDetail/PendingMessages';
import PropTypes from 'prop-types';
import React from 'react';
import { RecallPetitionModalDialog } from './RecallPetitionModalDialog';
import { ServeToIrsModalDialog } from './ServeToIrsModalDialog';
import { SuccessNotification } from './SuccessNotification';
import { UpdateCaseCaptionModalDialog } from './CaseDetailEdit/UpdateCaseCaptionModalDialog';
import { connect } from '@cerebral/react';
import { CreateMessageModalDialog } from './DocumentDetail/CreateMessageModalDialog';

class DocumentDetailComponent extends React.Component {
  render() {
    const {
      baseUrl,
      caseDetail,
      caseHelper,
      clickServeToIrsSequence,
      helper,
      openCaseCaptionModalSequence,
      showModal,
      token,
      setModalDialogNameSequence,
    } = this.props;
    return (
      <React.Fragment>
        <div className="usa-grid breadcrumb">
          <FontAwesomeIcon icon="caret-left" />
          <a href="/" id="queue-nav">
            Back
          </a>
        </div>
        <section className="usa-section usa-grid DocumentDetail">
          <h1 className="captioned" tabIndex="-1">
            <a href={'/case-detail/' + caseDetail.docketNumber}>
              Docket Number: {caseDetail.docketNumberWithSuffix}
            </a>
          </h1>
          <p className="float-left">{caseDetail.caseTitle} </p>
          {caseHelper.showCaptionEditButton && (
            <p className="float-left">
              <button
                className="link"
                id="caption-edit-button"
                onClick={() => {
                  openCaseCaptionModalSequence();
                }}
              >
                <FontAwesomeIcon icon="edit" size="sm" /> Edit
              </button>
            </p>
          )}
          {showModal == 'UpdateCaseCaptionModalDialog' && (
            <UpdateCaseCaptionModalDialog />
          )}

          <p className="clear-both">
            <span
              className="usa-label case-status-label"
              aria-label={`status: ${caseDetail.status}`}
            >
              <span aria-hidden="true">{caseDetail.status}</span>
            </span>
          </p>
          <hr aria-hidden="true" />
          <h1>{helper.formattedDocument.documentType}</h1>

          <SuccessNotification />
          <ErrorNotification />

          <div className="usa-grid-full">
            <div className="usa-width-one-third">
              <Tabs className="classic-horizontal-header3" bind="currentTab">
                {helper.showDocumentInfoTab && (
                  <Tab
                    tabName="Document Info"
                    title="Document Info"
                    id="tab-document-info"
                  >
                    <div
                      id="tab-document-info-panel"
                      aria-labelledby="tab-document-info"
                      tabIndex="0"
                    >
                      {helper.showCaseDetailsEdit && <CaseDetailEdit />}
                      {helper.showCaseDetailsView && <CaseDetailReadOnly />}
                    </div>
                  </Tab>
                )}
                <Tab
                  tabName="Messages"
                  title="Messages"
                  id="tab-pending-messages"
                >
                  <div
                    id="tab-pending-messages-panel"
                    aria-labelledby="tab-pending-messages"
                    tabIndex="0"
                  >
                    <Tabs
                      className="container-tabs"
                      id="case-detail-messages-tabs"
                      bind="documentDetail.messagesTab"
                    >
                      <Tab
                        tabName="inProgress"
                        title="In Progress"
                        id="tab-messages-in-progress"
                      >
                        <PendingMessages />
                      </Tab>
                      <Tab
                        tabName="completed"
                        title="Complete"
                        id="tab-messages-completed"
                      >
                        <CompletedMessages />
                      </Tab>
                    </Tabs>
                  </div>
                </Tab>
              </Tabs>
            </div>
            <div className="usa-width-two-thirds">
              <div className="top-bar clear-both">
                <p>
                  Filed {helper.formattedDocument.createdAtFormatted} by{' '}
                  {helper.formattedDocument.filedBy}
                </p>
                <div className="float-right">
                  {caseHelper.showServeToIrsButton &&
                    helper.formattedDocument.isPetition && (
                      <button
                        className="serve-to-irs"
                        onClick={() => clickServeToIrsSequence()}
                      >
                        <FontAwesomeIcon icon={['far', 'clock']} />
                        Serve to IRS
                      </button>
                    )}
                  {caseHelper.showRecallButton &&
                    helper.formattedDocument.isPetition && (
                      <div className="recall-button-box">
                        <FontAwesomeIcon icon={['far', 'clock']} />
                        Batched for IRS
                        <button
                          className="recall-petition"
                          onClick={() =>
                            setModalDialogNameSequence({
                              showModal: 'RecallPetitionModalDialog',
                            })
                          }
                        >
                          Recall
                        </button>
                      </div>
                    )}
                </div>
              </div>
              <iframe
                title={`Document type: ${
                  helper.formattedDocument.documentType
                }`}
                src={`${baseUrl}/documents/${
                  helper.formattedDocument.documentId
                }/documentDownloadUrl?token=${token}`}
              />
            </div>
          </div>
        </section>
        <div tabIndex="0" />
        {showModal === 'ServeToIrsModalDialog' && <ServeToIrsModalDialog />}
        {showModal === 'RecallPetitionModalDialog' && (
          <RecallPetitionModalDialog />
        )}
        {showModal === 'CreateMessageModalDialog' && (
          <CreateMessageModalDialog />
        )}
        <div tabIndex="0" />
      </React.Fragment>
    );
  }
}

DocumentDetailComponent.propTypes = {
  baseUrl: PropTypes.string,
  caseDetail: PropTypes.object,
  caseHelper: PropTypes.object,
  clickServeToIrsSequence: PropTypes.func,
  helper: PropTypes.object,
  openCaseCaptionModalSequence: PropTypes.func,
  setModalDialogNameSequence: PropTypes.func,
  showModal: PropTypes.string,
  token: PropTypes.string,
  workItemActions: PropTypes.object,
};

export const DocumentDetail = connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.formattedCaseDetail,
    caseHelper: state.caseDetailHelper,
    clickServeToIrsSequence: sequences.clickServeToIrsSequence,
    helper: state.documentDetailHelper,
    openCaseCaptionModalSequence: sequences.openCaseCaptionModalSequence,
    setModalDialogNameSequence: sequences.setModalDialogNameSequence,
    showModal: state.showModal,
    token: state.token,
    workItemActions: state.workItemActions,
  },
  DocumentDetailComponent,
);
