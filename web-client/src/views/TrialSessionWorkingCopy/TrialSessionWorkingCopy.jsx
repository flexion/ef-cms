import { AddEditCaseNoteModal } from './AddEditCaseNoteModal';
import { AddEditSessionNoteModal } from './AddEditSessionNoteModal';
import { DeleteCaseNoteConfirmModal } from './DeleteCaseNoteConfirmModal';
import { DeleteSessionNoteConfirmModal } from './DeleteSessionNoteConfirmModal';
import { Download } from '../../ustc-ui/Download/Download';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SessionNotes } from './SessionNotes';
import { SuccessNotification } from '../SuccessNotification';
import { TrialSessionDetailHeader } from '../TrialSessionDetail/TrialSessionDetailHeader';
import { WorkingCopySessionList } from './WorkingCopySessionList';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const TrialSessionWorkingCopy = connect(
  {
    clearDownloadSequence: sequences.clearDownloadSequence,
    download: state.download,
    downloadBatchOfTrialSessionSequence:
      sequences.downloadBatchOfTrialSessionSequence,
    formattedTrialSession: state.formattedTrialSessionDetails,
    showModal: state.showModal,
  },
  ({
    clearDownloadSequence,
    download,
    downloadBatchOfTrialSessionSequence,
    formattedTrialSession,
    showModal,
  }) => {
    return (
      <>
        <TrialSessionDetailHeader />
        <section className="usa-section grid-container">
          <div className="grid-row">
            <div className="grid-col-9">
              <h2 className="heading-1">Session Working Copy</h2>
            </div>
            <div className="grid-col-3 text-right padding-top-2">
              <button
                className="usa-button usa-button--unstyled"
                onClick={() => {
                  downloadBatchOfTrialSessionSequence({
                    trialSessionId: formattedTrialSession.trialSessionId,
                  });
                }}
              >
                <FontAwesomeIcon icon={['fas', 'cloud-download-alt']} />{' '}
                Download All Cases
              </button>
              {download && (
                <Download
                  blob={download.blob}
                  fileName={download.fileName}
                  mimeType="application/zip"
                  url={download.url}
                  onUnmount={() => clearDownloadSequence()}
                />
              )}
            </div>
          </div>

          <SuccessNotification />
          <ErrorNotification />
          <SessionNotes />
          <WorkingCopySessionList />
          {showModal === 'DeleteCaseNoteConfirmModal' && (
            <DeleteCaseNoteConfirmModal onConfirmSequence="deleteCaseNoteFromWorkingCopySequence" />
          )}
          {showModal === 'DeleteSessionNoteConfirmModal' && (
            <DeleteSessionNoteConfirmModal />
          )}
          {showModal === 'AddEditCaseNoteModal' && (
            <AddEditCaseNoteModal onConfirmSequence="updateCaseNoteOnWorkingCopySequence" />
          )}
          {showModal === 'AddEditSessionNoteModal' && (
            <AddEditSessionNoteModal />
          )}
        </section>
      </>
    );
  },
);
