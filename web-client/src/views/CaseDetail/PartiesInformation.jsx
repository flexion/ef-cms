import { AddPrivatePractitionerModal } from './AddPrivatePractitionerModal';
import { Button } from '../../ustc-ui/Button/Button';
import { EditPrivatePractitionersModal } from './EditPrivatePractitionersModal';
import { PetitionersAndCounsel } from './PetitionersAndCounsel';
import { PractitionerExistsModal } from './PractitionerExistsModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const PartiesInformation = connect(
  {
    partyViewTabs: state.constants.PARTY_VIEW_TABS,
    screenMetadata: state.screenMetadata,
    showModal: state.modal.showModal,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
  },
  function PartiesInformation({
    partyViewTabs,
    screenMetadata,
    showModal,
    updateScreenMetadataSequence,
  }) {
    return (
      <>
        <div className="grid-row grid-gap">
          <div className="grid-col-3">
            <div className="border border-base-lighter">
              <div className="grid-row padding-left-205 grid-header">
                Parties & Counsel
              </div>
              <div className="">
                <Button
                  className={classNames(
                    'usa-button--unstyled attachment-viewer-button',
                    screenMetadata.partyViewTab ===
                      partyViewTabs.petitionersAndCounsel && 'active',
                  )}
                  onClick={() => {
                    updateScreenMetadataSequence({
                      key: 'partyViewTab',
                      value: partyViewTabs.petitionersAndCounsel,
                    });
                  }}
                >
                  <div className="grid-row margin-left-205">
                    {partyViewTabs.petitionersAndCounsel}
                  </div>
                </Button>
                <Button
                  className={classNames(
                    'usa-button--unstyled attachment-viewer-button',
                    screenMetadata.partyViewTab ===
                      partyViewTabs.participantsAndCounsel && 'active',
                  )}
                  onClick={() => {
                    updateScreenMetadataSequence({
                      key: 'partyViewTab',
                      value: partyViewTabs.participantsAndCounsel,
                    });
                  }}
                >
                  <div className="grid-row margin-left-205">
                    {partyViewTabs.participantsAndCounsel}
                  </div>
                </Button>
                <Button
                  className={classNames(
                    'usa-button--unstyled attachment-viewer-button',
                    screenMetadata.partyViewTab ===
                      partyViewTabs.respondentCounsel && 'active',
                  )}
                  onClick={() => {
                    updateScreenMetadataSequence({
                      key: 'partyViewTab',
                      value: partyViewTabs.respondentCounsel,
                    });
                  }}
                >
                  <div className="grid-row margin-left-205">
                    {partyViewTabs.respondentCounsel}
                  </div>
                </Button>
              </div>
            </div>
          </div>
          <div className="grid-col-9">
            {screenMetadata.partyViewTab ===
              partyViewTabs.petitionersAndCounsel && (
              <>
                <PetitionersAndCounsel />
              </>
            )}
          </div>
        </div>
        {showModal === 'AddPrivatePractitionerModal' && (
          <AddPrivatePractitionerModal />
        )}
        {showModal === 'EditPrivatePractitionersModal' && (
          <EditPrivatePractitionersModal />
        )}
        {showModal === 'PractitionerExistsModal' && <PractitionerExistsModal />}
      </>
    );
  },
);

export { PartiesInformation };
