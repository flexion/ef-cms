import { AddressDisplay } from './AddressDisplay';
import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PartiesInformationContentHeader } from './PartiesInformationContentHeader';
import { ViewPetitionerCounselModal } from './ViewPetitionerCounselModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

const PetitionersAndCounsel = connect(
  {
    caseDetail: state.caseDetail,
    caseInformationHelper: state.caseInformationHelper,
    partiesInformationHelper: state.partiesInformationHelper,
    showModal: state.modal.showModal,
    showViewPetitionerCounselModalSequence:
      sequences.showViewPetitionerCounselModalSequence,
  },
  function PetitionersAndCounsel({
    caseDetail,
    caseInformationHelper,
    partiesInformationHelper,
    showModal,
    showViewPetitionerCounselModalSequence,
  }) {
    return (
      <>
        <PartiesInformationContentHeader title="Petitioner(s)" />
        <div className="grid-row grid-gap-2">
          {partiesInformationHelper.formattedPetitioners.map(petitioner => (
            <div
              className="tablet:grid-col-9 mobile:grid-col-9 desktop:grid-col-4 margin-bottom-4 petitioner-card"
              key={petitioner.contactId}
            >
              <div className="card height-full margin-bottom-0">
                <div className="content-wrapper parties-card">
                  <h3>
                    {petitioner.name}
                    {petitioner.canEditPetitioner && (
                      <Button
                        link
                        className="margin-top-1 padding-0 margin-right-0 float-right edit-petitioner-button"
                        href={`/case-detail/${caseDetail.docketNumber}/edit-petitioner-information/${petitioner.contactId}`}
                        icon="edit"
                      >
                        Edit
                      </Button>
                    )}
                  </h3>
                  <div className="bg-primary text-white padding-1 margin-bottom-2">
                    Petitioner
                  </div>
                  <AddressDisplay
                    contact={{
                      ...petitioner,
                      name: undefined,
                    }}
                    showEmail={false}
                  />
                  <span className="address-line">
                    {petitioner.formattedEmail}
                    {petitioner.showEAccessFlag && (
                      <FontAwesomeIcon
                        aria-label="has e-access"
                        className="margin-left-05 fa-icon-blue"
                        icon="flag"
                        size="1x"
                      />
                    )}
                  </span>
                  {petitioner.formattedPendingEmail}
                  {petitioner.serviceIndicator && (
                    <div className="margin-top-4">
                      <p className="semi-bold margin-bottom-0">
                        Service preference
                      </p>
                      {petitioner.serviceIndicator}
                    </div>
                  )}
                  <h4 className="margin-top-3">Counsel</h4>
                  {petitioner.hasCounsel &&
                    petitioner.representingPractitioners.map(
                      privatePractitioner => (
                        <p key={privatePractitioner.userId}>
                          <span className="address-line">
                            {privatePractitioner.name}{' '}
                            {`(${privatePractitioner.barNumber})`}{' '}
                            {caseInformationHelper.showEditPrivatePractitioners && (
                              <Button
                                link
                                className="margin-left-1 padding-0 height-3"
                                href={`/case-detail/${caseDetail.docketNumber}/edit-petitioner-counsel/${privatePractitioner.barNumber}`}
                                icon="edit"
                                id="edit-privatePractitioners-button"
                                overrideMargin={true}
                              >
                                Edit
                              </Button>
                            )}
                            {caseInformationHelper.showViewPrivatePractitioners && (
                              <Button
                                link
                                className="margin-left-1 padding-0 height-3"
                                icon={['fas', 'eye']}
                                id="view-privatePractitioners-button"
                                overrideMargin={true}
                                onClick={() => {
                                  showViewPetitionerCounselModalSequence({
                                    privatePractitioner,
                                  });
                                }}
                              >
                                View
                              </Button>
                            )}
                          </span>
                          <span className="address-line">
                            {privatePractitioner.formattedEmail}
                          </span>
                          {privatePractitioner.formattedPendingEmail}
                          <span className="address-line">
                            {privatePractitioner.contact.phone}
                          </span>
                        </p>
                      ),
                    )}
                  {!petitioner.hasCounsel && 'None'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal === 'ViewPetitionerCounselModal' && (
          <ViewPetitionerCounselModal />
        )}
      </>
    );
  },
);

export { PetitionersAndCounsel };
