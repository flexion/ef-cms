import { AddPractitionerModal } from './AddPractitionerModal';
import { AddRespondentModal } from './AddRespondentModal';
import { EditSecondaryContactModal } from '../EditSecondaryContactModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PartyInformation = connect(
  {
    caseDetail: state.formattedCaseDetail,
    caseHelper: state.caseDetailHelper,
    constants: state.constants,
    editSecondaryContact: sequences.openEditSecondaryContactModalSequence,
    openAddPractitionerModalSequence:
      sequences.openAddPractitionerModalSequence,
    openAddRespondentModalSequence: sequences.openAddRespondentModalSequence,
    showModal: state.showModal,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  ({
    caseDetail,
    caseHelper,
    constants,
    editSecondaryContact,
    openAddPractitionerModalSequence,
    openAddRespondentModalSequence,
    showModal,
    updateFormValueSequence,
    validationErrors,
  }) => {
    const mainPartyInformation = () => (
      <div className="grid-container padding-x-0">
        <div className="grid-row">
          <div className="tablet:grid-col-3">
            {caseDetail.contactPrimary && (
              <div>
                <address aria-labelledby="primary-label">
                  {addressDisplay(caseDetail.contactPrimary, {
                    nameOverride:
                      caseHelper.showCaseNameForPrimary && caseDetail.caseName,
                  })}
                </address>

                {caseHelper.showEditContactButton && (
                  <a
                    href={`/case-detail/${caseDetail.docketNumber}/contacts/primary/edit`}
                  >
                    <FontAwesomeIcon icon="edit" size="sm" />
                    Edit
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="tablet:grid-col-3">
            {caseDetail.contactSecondary && caseDetail.contactSecondary.name && (
              <div>
                <address aria-labelledby="secondary-label">
                  {caseDetail.contactSecondary.name &&
                    addressDisplay(caseDetail.contactSecondary, {})}
                </address>
                {caseHelper.showEditContactButton && (
                  <button
                    className="usa-button usa-button--unstyled"
                    onClick={() => editSecondaryContact()}
                  >
                    <FontAwesomeIcon icon="question-circle" size="sm" />
                    Why can’t I edit this?
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );

    const practitionerPartyInformation = () => (
      <div className="grid-container padding-x-0">
        <div className="grid-row">
          {caseDetail.practitioners &&
            caseDetail.practitioners.map((practitioner, index) => (
              <div
                className={`tablet:grid-col-3 ${
                  index > 3 ? 'margin-top-3' : ''
                }`}
                key={index}
              >
                <address aria-labelledby="practitioner-label">
                  {practitioner.name &&
                    addressDisplay(
                      {
                        ...practitioner,
                        address1: practitioner.addressLine1,
                        address2: practitioner.addressLine2,
                        address3: practitioner.addressLine3,
                      },
                      {
                        nameOverride: practitioner.formattedName,
                      },
                    )}
                </address>
                <p className="label representing-label margin-top-2">
                  Representing
                </p>
                {practitioner.representingPrimary &&
                  caseDetail.contactPrimary.name}
                {practitioner.representingPrimary &&
                  practitioner.representingSecondary && <br />}
                {practitioner.representingSecondary &&
                  caseDetail.contactSecondary &&
                  caseDetail.contactSecondary.name}
              </div>
            ))}
        </div>
      </div>
    );

    const respondentPartyInformation = () => (
      <div className="grid-container padding-x-0">
        <div className="grid-row">
          {caseDetail.respondents &&
            caseDetail.respondents.map((respondent, index) => (
              <div
                className={`tablet:grid-col-3 ${
                  index > 3 ? 'margin-top-3' : ''
                }`}
                key={index}
              >
                <address aria-labelledby="respondent-label">
                  {respondent.name &&
                    addressDisplay(
                      {
                        ...respondent,
                        address1: respondent.addressLine1,
                        address2: respondent.addressLine2,
                        address3: respondent.addressLine3,
                      },
                      {
                        nameOverride: respondent.formattedName,
                      },
                    )}
                </address>
              </div>
            ))}
        </div>
      </div>
    );

    const practitionerSearch = () => (
      <>
        <div className="grid-col-3 text-right">
          <span
            className="label margin-right-4 margin-top-05"
            id="practitioner-counsel-search-description"
          >
            Add Counsel
          </span>
        </div>
        <div className="grid-col-3 margin-top-neg-05">
          <div
            className={`usa-form-group ${
              validationErrors.practitionerSearchError
                ? 'usa-form-group--error margin-bottom-2'
                : 'margin-bottom-0'
            }`}
          >
            <form
              className="usa-search"
              onSubmit={e => {
                e.preventDefault();
                openAddPractitionerModalSequence();
              }}
            >
              <div role="search">
                <label
                  className="usa-sr-only"
                  htmlFor="practitioner-search-field"
                >
                  Search
                </label>
                <input
                  aria-describedby="practitioner-counsel-search-description"
                  className={`usa-input margin-bottom-0 
                    ${
                      validationErrors.practitionerSearchError
                        ? 'usa-input--error'
                        : ''
                    }`}
                  id="practitioner-search-field"
                  name="practitionerSearch"
                  placeholder="Enter Bar Number or Name"
                  type="search"
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
                <button className="usa-button" type="submit">
                  <span className="usa-search__submit-text">Search</span>
                </button>
              </div>
              <Text
                bind="validationErrors.practitionerSearchError"
                className="usa-error-message"
              />
            </form>
          </div>
        </div>
      </>
    );

    const respondentSearch = () => (
      <>
        <div className="grid-col-3 text-right">
          <span
            className="label margin-right-4 margin-top-05"
            id="respondent-counsel-search-description"
          >
            Add Counsel
          </span>
        </div>
        <div className="grid-col-3 margin-top-neg-05">
          <div
            className={`usa-form-group ${
              validationErrors.respondentSearchError
                ? 'usa-form-group--error margin-bottom-2'
                : 'margin-bottom-0'
            }`}
          >
            <form
              className="usa-search"
              onSubmit={e => {
                e.preventDefault();
                openAddRespondentModalSequence();
              }}
            >
              <div role="search">
                <label
                  className="usa-sr-only"
                  htmlFor="respondent-search-field"
                >
                  Search
                </label>
                <input
                  aria-describedby="respondent-counsel-search-description"
                  className={`usa-input margin-bottom-0 
                  ${
                    validationErrors.respondentSearchError
                      ? 'usa-input--error'
                      : ''
                  }`}
                  id="respondent-search-field"
                  name="respondentSearch"
                  placeholder="Enter Bar Number or Name"
                  type="search"
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
                <button className="usa-button" type="submit">
                  <span className="usa-search__submit-text">Search</span>
                </button>
              </div>
              <Text
                bind="validationErrors.respondentSearchError"
                className="usa-error-message"
              />
            </form>
          </div>
        </div>
      </>
    );

    const addressDisplay = (contact, { nameOverride } = {}) => {
      return (
        <React.Fragment>
          <p className="margin-top-0">
            {nameOverride || contact.name}
            {contact.inCareOf && (
              <span>
                <br />
                c/o {contact.inCareOf}
              </span>
            )}
          </p>
          <p>
            <span className="address-line">{contact.address1}</span>
            <span className="address-line">{contact.address2}</span>
            {contact.address3 && (
              <span className="address-line">{contact.address3}</span>
            )}
            <span className="address-line">
              {contact.city && `${contact.city}, `}
              {contact.state} {contact.postalCode}
            </span>
            <span className="address-line">
              {contact.countryType === constants.COUNTRY_TYPES.INTERNATIONAL &&
                contact.country}
            </span>
          </p>
          {contact.phone && <p>{contact.phone}</p>}
        </React.Fragment>
      );
    };

    return (
      <>
        <div className="subsection party-information">
          <div className="card">
            <div className="content-wrapper">
              <h3 className="underlined" id="primary-label">
                {caseDetail.partyType || 'My Party Type'}
              </h3>
              {mainPartyInformation()}
            </div>
          </div>
        </div>
        {caseHelper.showPractitionerSection && (
          <div className="subsection party-information">
            <div className="card">
              <div className="content-wrapper">
                <div className="grid-row header-row">
                  <div className="grid-col-6" id="practitioner-label">
                    <h3>Petitioner Counsel</h3>
                  </div>
                  {caseHelper.showAddCounsel && practitionerSearch()}
                </div>
                {practitionerPartyInformation()}
              </div>
            </div>
          </div>
        )}
        {caseHelper.showRespondentSection && (
          <div className="subsection party-information">
            <div className="card">
              <div className="content-wrapper">
                <div className="grid-row header-row">
                  <div className="grid-col-6" id="secondary-label">
                    <h3>Respondent Counsel</h3>
                  </div>
                  {caseHelper.showAddCounsel && respondentSearch()}
                </div>
                {respondentPartyInformation()}
              </div>
            </div>
          </div>
        )}
        {caseHelper.showEditSecondaryContactModal && (
          <EditSecondaryContactModal />
        )}
        {showModal === 'AddPractitionerModal' && <AddPractitionerModal />}
        {showModal === 'AddRespondentModal' && <AddRespondentModal />}
      </>
    );
  },
);
