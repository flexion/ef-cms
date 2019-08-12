import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const TrialSessionDetailHeader = connect(
  {
    formattedTrialSession: state.formattedTrialSessionDetails,
    navigateToPathSequence: sequences.navigateToPathSequence,
    trialSessionHelper: state.trialSessionHelper,
  },
  ({ formattedTrialSession, navigateToPathSequence, trialSessionHelper }) => (
    <>
      <div className="big-blue-header">
        <div className="grid-container">
          <div className="margin-bottom-1">
            <h1 tabIndex="-1">{formattedTrialSession.trialLocation}</h1>
            <span
              className={`usa-tag ${
                !formattedTrialSession.isCalendared ? 'ustc-tag--yellow' : ''
              }`}
            >
              <span aria-hidden="true">
                {formattedTrialSession.formattedTerm}:{' '}
                {formattedTrialSession.status}
              </span>
            </span>
            {trialSessionHelper.showSwitchToWorkingCopy && (
              <button
                className="button-switch-box usa-button usa-button--unstyled"
                onClick={() => {
                  navigateToPathSequence();
                }}
              >
                <FontAwesomeIcon icon={['far', 'clone']} />
                Switch to Working Copy
              </button>
            )}
            {trialSessionHelper.showSwitchToSessionDetail && (
              <button
                className="button-switch-box usa-button usa-button--unstyled"
                onClick={() => {
                  navigateToPathSequence();
                }}
              >
                <FontAwesomeIcon icon={['far', 'clone']} />
                Switch to Session Detail
              </button>
            )}
          </div>
          <p className="margin-y-0" id="case-title">
            <span>{formattedTrialSession.formattedStartDate}</span>
          </p>
        </div>
      </div>
    </>
  ),
);
