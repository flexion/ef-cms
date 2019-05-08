import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UpdateCaseCaptionModalDialog } from './CaseDetailEdit/UpdateCaseCaptionModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseDetailHeader = connect(
  {
    caseDetail: state.formattedCaseDetail,
    caseHelper: state.caseDetailHelper,
    openCaseCaptionModalSequence: sequences.openCaseCaptionModalSequence,
    showModal: state.showModal,
  },
  ({ caseDetail, caseHelper, showModal, openCaseCaptionModalSequence }) => {
    return (
      <React.Fragment>
        <div>
          <h1 className="heading-2 captioned" tabIndex="-1">
            <a href={'/case-detail/' + caseDetail.docketNumber}>
              Docket Number: {caseDetail.docketNumberWithSuffix}
            </a>
          </h1>
          <span
            className="usa-tag case-status-label"
            aria-label={`status: ${caseDetail.status}`}
          >
            <span aria-hidden="true">{caseDetail.status}</span>
          </span>
        </div>
        <p id="case-title" className="float-left no-bottom-margin">
          {caseDetail.caseTitle}
        </p>
        {caseHelper.showCaptionEditButton && (
          <p className="float-left no-bottom-margin">
            <button
              className="usa-button usa-button--unstyled"
              id="caption-edit-button"
              onClick={() => {
                openCaseCaptionModalSequence();
              }}
            >
              <FontAwesomeIcon icon="edit" size="sm" />
              Edit
            </button>
          </p>
        )}
        {showModal == 'UpdateCaseCaptionModalDialog' && (
          <UpdateCaseCaptionModalDialog />
        )}
        <div className="clear-both" />
      </React.Fragment>
    );
  },
);
