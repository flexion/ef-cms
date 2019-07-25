import { CaseDifferenceExplained } from '../CaseDifferenceExplained';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Overlay } from '../../ustc-ui/Overlay/Overlay';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const CaseDifferenceModalOverlay = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
  },
  ({ clearModalSequence }) => {
    return (
      <>
        <Overlay
          className="case-difference-overlay"
          onEscSequence="clearModalSequence"
        >
          <div className="overlay-blue-header">
            <div className="grid-container">
              <button
                aria-roledescription="button to return to file a petition"
                className="heading-3 usa-button usa-button--unstyled"
                onClick={() => clearModalSequence()}
              >
                <FontAwesomeIcon icon="caret-left" />
                Back to File a Petition
              </button>
            </div>
          </div>
          <div className="grid-container">
            <CaseDifferenceExplained />
          </div>
        </Overlay>
      </>
    );
  },
);
