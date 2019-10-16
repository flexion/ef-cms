import { BlockFromTrialModal } from './CaseDetail/BlockFromTrialModal';
import { Button } from '../ustc-ui/Button/Button';
import { CaseDeadlinesInternal } from './CaseDetail/CaseDeadlinesInternal';
import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseInformationInternal } from './CaseDetail/CaseInformationInternal';
import { CaseNotes } from './CaseDetail/CaseNotes';
import { CreateCaseDeadlineModalDialog } from './CaseDetail/CreateCaseDeadlineModalDialog';
import { DeleteCaseDeadlineModalDialog } from './CaseDetail/DeleteCaseDeadlineModalDialog';
import { DocketRecord } from './DocketRecord/DocketRecord';
import { DraftDocuments } from './DraftDocuments/DraftDocuments';
import { EditCaseDeadlineModalDialog } from './CaseDetail/EditCaseDeadlineModalDialog';
import { ErrorNotification } from './ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MessagesInProgress } from './CaseDetail/MessagesInProgress';
import { PartyInformation } from './CaseDetail/PartyInformation';
import { SuccessNotification } from './SuccessNotification';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { UnblockFromTrialModal } from './CaseDetail/UnblockFromTrialModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseDetailInternal = connect(
  {
    baseUrl: state.baseUrl,
    caseDetailHelper: state.caseDetailHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    setCaseDetailPageTabSequence: sequences.setCaseDetailPageTabSequence,
    setCaseToReadyForTrialSequence: sequences.setCaseToReadyForTrialSequence,
    showModal: state.showModal,
    token: state.token,
  },
  ({
    baseUrl,
    caseDetailHelper,
    formattedCaseDetail,
    setCaseDetailPageTabSequence,
    setCaseToReadyForTrialSequence,
    showModal,
    token,
  }) => {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <CaseDeadlinesInternal />

          <div>
            <div className="title">
              <h1>Messages in Progress</h1>
            </div>
            <MessagesInProgress />
          </div>
          <div className="only-small-screens">
            <div className="margin-bottom-3">
              <select
                aria-label="additional case info"
                className="usa-select"
                id="mobile-document-detail-tab-selector"
                name="partyType"
                value={caseDetailHelper.documentDetailTab}
                onChange={e => {
                  setCaseDetailPageTabSequence({
                    tab: e.target.value,
                  });
                }}
              >
                <option value="docketRecord">Docket Record</option>
                <option value="caseInfo">Case Information</option>
              </select>
            </div>
          </div>
          <div className="mobile-document-detail-tabs">
            <Tabs
              bind="caseDetailPage.informationTab"
              className="classic-horizontal-header3 tab-border"
            >
              <Tab
                id="tab-docket-record"
                tabName="docketRecord"
                title="Docket Record"
              >
                <DocketRecord />
              </Tab>
              <Tab
                id="tab-draft-documents"
                tabName="draftDocuments"
                title="Draft Documents"
              >
                <DraftDocuments />
              </Tab>
              <Tab
                id="tab-case-info"
                tabName="caseInfo"
                title="Case Information"
              >
                <CaseInformationInternal />
                <div className="case-detail-party-info">
                  <PartyInformation />
                </div>
              </Tab>
              {caseDetailHelper.showNotes && (
                <Tab id="tab-case-notes" tabName="caseNotes" title="Notes">
                  <CaseNotes />
                </Tab>
              )}
            </Tabs>
          </div>
        </section>
        {/* This section below will be removed in a future story */}
        <section className="usa-section grid-container">
          {formattedCaseDetail.status === 'General Docket - Not at Issue' && (
            <>
              {formattedCaseDetail.contactPrimary && (
                <a
                  aria-label="View PDF"
                  href={`${baseUrl}/documents/${
                    formattedCaseDetail.docketNumber
                  }_${formattedCaseDetail.contactPrimary.name.replace(
                    /\s/g,
                    '_',
                  )}.zip/document-download-url?token=${token}`}
                >
                  <FontAwesomeIcon icon={['far', 'file-pdf']} />
                  Batch Zip Download
                </a>
              )}
              <Button
                secondary
                onClick={() => setCaseToReadyForTrialSequence()}
              >
                Set Case Status to Ready for Trial
              </Button>
            </>
          )}
        </section>

        {showModal === 'CreateCaseDeadlineModalDialog' && (
          <CreateCaseDeadlineModalDialog />
        )}
        {showModal === 'EditCaseDeadlineModalDialog' && (
          <EditCaseDeadlineModalDialog />
        )}
        {showModal === 'DeleteCaseDeadlineModalDialog' && (
          <DeleteCaseDeadlineModalDialog />
        )}
        {showModal === 'BlockFromTrialModal' && <BlockFromTrialModal />}
        {showModal === 'UnblockFromTrialModal' && <UnblockFromTrialModal />}
      </>
    );
  },
);
