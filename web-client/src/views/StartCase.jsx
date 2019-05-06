import { CaseDifferenceExplained } from './CaseDifferenceExplained';
import { CaseTypeSelect } from './StartCase/CaseTypeSelect';
import { Contacts } from './StartCase/Contacts';
import { ErrorNotification } from './ErrorNotification';
import { FileUploadErrorModal } from './FileUploadErrorModal';
import { FileUploadStatusModal } from './FileUploadStatusModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormCancelModalDialog } from './FormCancelModalDialog';
import { ProcedureType } from './StartCase/ProcedureType';
import { Text } from '../ustc-ui/Text/Text';
import { TrialCity } from './StartCase/TrialCity';
import { connect } from '@cerebral/react';
import { limitFileSize } from './limitFileSize';
import { sequences, state } from 'cerebral';

import React from 'react';

export const StartCase = connect(
  {
    caseTypeDescriptionHelper: state.caseTypeDescriptionHelper,
    clearPreferredTrialCitySequence: sequences.clearPreferredTrialCitySequence,
    constants: state.constants,
    filingTypes: state.filingTypes,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    screenMetadata: state.screenMetadata,
    showModal: state.showModal,
    startCaseHelper: state.startCaseHelper,
    submitFilePetitionSequence: sequences.submitFilePetitionSequence,
    toggleCaseDifferenceSequence: sequences.toggleCaseDifferenceSequence,
    trialCitiesHelper: state.trialCitiesHelper,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updateHasIrsNoticeFormValueSequence:
      sequences.updateHasIrsNoticeFormValueSequence,
    updatePetitionValueSequence: sequences.updatePetitionValueSequence,
    updateStartCaseFormValueSequence:
      sequences.updateStartCaseFormValueSequence,
    validateStartCaseSequence: sequences.validateStartCaseSequence,
    validationErrors: state.validationErrors,
  },
  ({
    caseTypeDescriptionHelper,
    clearPreferredTrialCitySequence,
    constants,
    filingTypes,
    form,
    screenMetadata,
    showModal,
    formCancelToggleCancelSequence,
    startCaseHelper,
    submitFilePetitionSequence,
    toggleCaseDifferenceSequence,
    trialCitiesHelper,
    updateFormValueSequence,
    updateHasIrsNoticeFormValueSequence,
    updatePetitionValueSequence,
    updateStartCaseFormValueSequence,
    validateStartCaseSequence,
    validationErrors,
  }) => {
    return (
      <section className="usa-section usa-grid">
        <form
          role="form"
          aria-labelledby="start-case-header"
          noValidate
          onSubmit={e => {
            e.preventDefault();
            submitFilePetitionSequence();
          }}
        >
          <h1 tabIndex="-1" id="start-case-header">
            Start a Case
          </h1>
          {showModal === 'FormCancelModalDialogComponent' && (
            <FormCancelModalDialog />
          )}
          <ErrorNotification />
          <p className="required-statement">All fields required</p>
          <h2>Upload Your Petition to Start Your Case</h2>

          <div className="blue-container">
            <div className="usa-grid-full">
              <div className="usa-width-seven-twelfths push-right">
                <div
                  id="petition-upload-hint"
                  className="alert-gold add-bottom-margin"
                >
                  <span className="usa-form-hint ustc-form-hint-with-svg">
                    <FontAwesomeIcon
                      icon={['far', 'arrow-alt-circle-left']}
                      className="fa-icon-gold"
                      size="lg"
                    />
                    This should include your Petition form and any IRS notice
                    <span aria-hidden="true">(s)</span> you received.
                  </span>
                </div>
              </div>

              <div className="usa-width-five-twelfths">
                <div
                  className={`ustc-form-group ${
                    validationErrors.petitionFile ? 'usa-input-error' : ''
                  }`}
                >
                  <label
                    htmlFor="petition-file"
                    className={
                      'ustc-upload-petition with-hint ' +
                      (startCaseHelper.showPetitionFileValid ? 'validated' : '')
                    }
                  >
                    Upload Your Petition{' '}
                    <span className="success-message">
                      <FontAwesomeIcon icon="check-circle" size="sm" />
                    </span>
                  </label>
                  <span className="usa-form-hint">
                    File must be in PDF format (.pdf). Max file size{' '}
                    {constants.MAX_FILE_SIZE_MB}MB.
                  </span>
                  <input
                    id="petition-file"
                    type="file"
                    accept=".pdf"
                    aria-describedby="petition-hint"
                    name="petitionFile"
                    onChange={e => {
                      limitFileSize(e, constants.MAX_FILE_SIZE_MB, () => {
                        updatePetitionValueSequence({
                          key: e.target.name,
                          value: e.target.files[0],
                        });
                        updatePetitionValueSequence({
                          key: `${e.target.name}Size`,
                          value: e.target.files[0].size,
                        });
                        validateStartCaseSequence();
                      });
                    }}
                  />
                  <Text
                    className="usa-input-error-message"
                    bind="validationErrors.petitionFile"
                  />
                  <Text
                    className="usa-input-error-message"
                    bind="validationErrors.petitionFileSize"
                  />
                </div>
              </div>
            </div>
          </div>

          <h2>Upload Your Statement of Taxpayer Identification</h2>
          <div className="blue-container">
            <div
              className={`ustc-form-group ${
                validationErrors.stinFile ? 'usa-input-error' : ''
              }`}
            >
              <label
                htmlFor="stin-file"
                className={
                  'ustc-upload-stin with-hint ' +
                  (startCaseHelper.showStinFileValid ? 'validated' : '')
                }
              >
                Upload Your Statement of Taxpayer Identification
                <span className="success-message">
                  <FontAwesomeIcon icon="check-circle" size="sm" />
                </span>
              </label>
              <span className="usa-form-hint">
                File must be in PDF format (.pdf). Max file size{' '}
                {constants.MAX_FILE_SIZE_MB}MB.
              </span>
              <input
                id="stin-file"
                type="file"
                accept=".pdf"
                name="stinFile"
                onChange={e => {
                  limitFileSize(e, constants.MAX_FILE_SIZE_MB, () => {
                    updatePetitionValueSequence({
                      key: e.target.name,
                      value: e.target.files[0],
                    });
                    updatePetitionValueSequence({
                      key: `${e.target.name}Size`,
                      value: e.target.files[0].size,
                    });
                    validateStartCaseSequence();
                  });
                }}
              />
              <Text
                className="usa-input-error-message"
                bind="validationErrors.stinFile"
              />
              <Text
                className="usa-input-error-message"
                bind="validationErrors.stinFileSize"
              />
            </div>
          </div>

          <h2>Who is Filing This Case?</h2>
          <div className="blue-container">
            <div className="usa-grid-full">
              <div className="usa-width-seven-twelfths push-right">
                <div
                  id="petition-hint"
                  className="alert-gold add-bottom-margin"
                >
                  <span className="usa-form-hint ustc-form-hint-with-svg">
                    <FontAwesomeIcon
                      icon={['far', 'arrow-alt-circle-left']}
                      className="fa-icon-gold"
                      size="lg"
                    />
                    To file a case on behalf of another taxpayer, you must be
                    authorized to litigate in this Court as provided by the Tax
                    Court Rules of Practice and Procedure (Rule 60). Enrolled
                    agents, certified public accountants, and powers of attorney
                    who are not admitted to practice before the Court are not
                    eligible to represent taxpayers.
                  </span>
                </div>
              </div>
              <div className="usa-width-five-twelfths">
                <div
                  className={
                    'ustc-form-group ' +
                    (validationErrors.filingType ? 'usa-input-error' : '')
                  }
                >
                  <fieldset
                    id="filing-type-radios"
                    className="usa-fieldset-inputs usa-sans"
                  >
                    <legend htmlFor="filing-type-radios">
                      I am filing this petition on behalf of …
                    </legend>
                    <ul className="ustc-unstyled-list">
                      {filingTypes.map((filingType, idx) => (
                        <li key={filingType}>
                          <input
                            id={filingType}
                            data-type={filingType}
                            type="radio"
                            name="filingType"
                            value={filingType}
                            onChange={e => {
                              updateStartCaseFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                              validateStartCaseSequence();
                            }}
                          />
                          <label id={`filing-type-${idx}`} htmlFor={filingType}>
                            {filingType}
                          </label>
                        </li>
                      ))}
                    </ul>
                    <Text
                      className="usa-input-error-message"
                      bind="validationErrors.partyType"
                    />
                  </fieldset>
                </div>
              </div>
            </div>

            {startCaseHelper.showPetitionerDeceasedSpouseForm && (
              <div
                className={
                  'ustc-secondary-question ' +
                  (validationErrors.partyType ? 'usa-input-error' : '')
                }
              >
                <fieldset
                  id="deceased-spouse-radios"
                  className="usa-fieldset-inputs usa-sans"
                >
                  <legend htmlFor="deceased-spouse-radios">
                    {startCaseHelper.deceasedSpouseLegend}
                  </legend>
                  <ul className="usa-unstyled-list">
                    {['Yes', 'No'].map((isSpouseDeceased, idx) => (
                      <li key={isSpouseDeceased}>
                        <input
                          id={`isSpouseDeceased-${isSpouseDeceased}`}
                          type="radio"
                          name="isSpouseDeceased"
                          value={isSpouseDeceased}
                          onChange={e => {
                            updateStartCaseFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                            validateStartCaseSequence();
                          }}
                        />
                        <label
                          id={`is-spouse-deceased-${idx}`}
                          htmlFor={`isSpouseDeceased-${isSpouseDeceased}`}
                        >
                          {isSpouseDeceased}
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              </div>
            )}

            {startCaseHelper.showBusinessFilingTypeOptions && (
              <div
                className={
                  'ustc-secondary-question ' +
                  (validationErrors.partyType ? 'usa-input-error' : '')
                }
              >
                <fieldset
                  id="business-type-radios"
                  className="usa-fieldset-inputs usa-sans"
                >
                  <legend htmlFor="business-type-radios">
                    What type of business are you filing for?
                  </legend>
                  <ul className="ustc-unstyled-list">
                    {[
                      constants.BUSINESS_TYPES.corporation,
                      constants.BUSINESS_TYPES.partnershipAsTaxMattersPartner,
                      constants.BUSINESS_TYPES.partnershipOtherThanTaxMatters,
                      constants.BUSINESS_TYPES.partnershipBBA,
                    ].map((businessType, idx) => (
                      <li key={businessType}>
                        <input
                          id={`businessType-${businessType}`}
                          type="radio"
                          name="businessType"
                          value={businessType}
                          onChange={e => {
                            updateStartCaseFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                            validateStartCaseSequence();
                          }}
                        />
                        <label
                          id={`is-business-type-${idx}`}
                          htmlFor={`businessType-${businessType}`}
                        >
                          {businessType}
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              </div>
            )}
            {startCaseHelper.showOtherFilingTypeOptions && (
              <div
                className={
                  'ustc-secondary-question ' +
                  (validationErrors.partyType ? 'usa-input-error' : '')
                }
              >
                <fieldset
                  id="other-type-radios"
                  className="usa-fieldset-inputs usa-sans"
                >
                  <legend htmlFor="other-type-radios">
                    What other type of taxpayer are you filing for?
                  </legend>
                  <ul className="ustc-unstyled-list">
                    {[
                      'An estate or trust',
                      'A minor or legally incompetent person',
                      'Donor',
                      'Transferee',
                      'Deceased Spouse',
                    ].map((otherType, idx) => (
                      <li key={otherType}>
                        <input
                          id={`otherType-${otherType}`}
                          type="radio"
                          name="otherType"
                          value={otherType}
                          onChange={e => {
                            updateStartCaseFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                            validateStartCaseSequence();
                          }}
                        />
                        <label
                          id={`is-other-type-${idx}`}
                          htmlFor={`otherType-${otherType}`}
                        >
                          {otherType}
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              </div>
            )}

            {startCaseHelper.showOtherFilingTypeOptions &&
              startCaseHelper.showEstateFilingOptions && (
                <div
                  className={
                    'ustc-secondary-question ' +
                    (validationErrors.partyType ? 'usa-input-error' : '')
                  }
                >
                  <fieldset
                    id="estate-type-radios"
                    className="usa-fieldset-inputs usa-sans"
                  >
                    <legend htmlFor="estate-type-radios">
                      What type of estate or trust are you filing for?
                    </legend>
                    <ul className="ustc-unstyled-list">
                      {[
                        constants.ESTATE_TYPES.estate,
                        constants.ESTATE_TYPES.estateWithoutExecutor,
                        constants.ESTATE_TYPES.trust,
                      ].map((estateType, idx) => (
                        <li key={estateType}>
                          <input
                            id={`estateType-${estateType}`}
                            type="radio"
                            name="estateType"
                            value={estateType}
                            onChange={e => {
                              updateStartCaseFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                              validateStartCaseSequence();
                            }}
                          />
                          <label
                            id={`is-estate-type-${idx}`}
                            htmlFor={`estateType-${estateType}`}
                          >
                            {estateType}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </fieldset>
                </div>
              )}

            {startCaseHelper.showOtherFilingTypeOptions &&
              startCaseHelper.showMinorIncompetentFilingOptions && (
                <div
                  className={
                    'ustc-secondary-question ' +
                    (validationErrors.partyType ? 'usa-input-error' : '')
                  }
                >
                  <fieldset
                    id="minorIncompetent-type-radios"
                    className="usa-fieldset-inputs usa-sans"
                  >
                    <legend htmlFor="minorIncompetent-type-radios">
                      {startCaseHelper.minorIncompetentLegend}
                    </legend>
                    <ul className="ustc-unstyled-list">
                      {[
                        constants.OTHER_TYPES.conservator,
                        constants.OTHER_TYPES.guardian,
                        constants.OTHER_TYPES.custodian,
                        constants.OTHER_TYPES.nextFriendForMinor,
                        constants.OTHER_TYPES.nextFriendForIncompetentPerson,
                      ].map((minorIncompetentType, idx) => (
                        <li key={minorIncompetentType}>
                          <input
                            id={`minorIncompetentType-${minorIncompetentType}`}
                            type="radio"
                            name="minorIncompetentType"
                            value={minorIncompetentType}
                            onChange={e => {
                              updateStartCaseFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                              validateStartCaseSequence();
                            }}
                          />
                          <label
                            id={`is-minorIncompetent-type-${idx}`}
                            htmlFor={`minorIncompetentType-${minorIncompetentType}`}
                          >
                            {minorIncompetentType}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </fieldset>
                </div>
              )}
          </div>

          <Contacts
            parentView="StartCase"
            bind="form"
            emailBind="user"
            onChange="updateFormValueSequence"
            onBlur="validateStartCaseSequence"
            contactsHelper="contactsHelper"
            showPrimaryContact={startCaseHelper.showPrimaryContact}
            showSecondaryContact={startCaseHelper.showSecondaryContact}
          />

          {/*start ods*/}
          {startCaseHelper.showOwnershipDisclosure && (
            <div className="usa-form-group">
              <h2>Ownership Disclosure Statement</h2>
              <p>
                Tax Court Rules of Practice and Procedure (Rule 60) requires a
                corporation, partnership, or limited liability company, filing a
                Petition with the Court to also file an Ownership Disclosure
                Statement (ODS). Complete your{' '}
                <a
                  href="https://www.ustaxcourt.gov/forms/Ownership_Disclosure_Statement_Form_6.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ownership Disclosure Statement Form 6
                </a>
                .
              </p>
              <div className="blue-container">
                <label
                  htmlFor="ownership-disclosure-file"
                  className={
                    'ustc-upload-ods with-hint ' +
                    (startCaseHelper.showOwnershipDisclosureValid
                      ? 'validated'
                      : '')
                  }
                >
                  Upload your Ownership Disclosure Statement
                  <span className="success-message">
                    <FontAwesomeIcon icon="check-circle" size="sm" />
                  </span>
                </label>
                <span className="usa-form-hint">
                  File must be in PDF format (.pdf). Max file size{' '}
                  {constants.MAX_FILE_SIZE_MB}MB.
                </span>
                <input
                  id="ownership-disclosure-file"
                  type="file"
                  accept=".pdf"
                  name="ownershipDisclosureFile"
                  onChange={e => {
                    limitFileSize(e, constants.MAX_FILE_SIZE_MB, () => {
                      updatePetitionValueSequence({
                        key: e.target.name,
                        value: e.target.files[0],
                      });
                      updatePetitionValueSequence({
                        key: `${e.target.name}Size`,
                        value: e.target.files[0].size,
                      });
                      validateStartCaseSequence();
                    });
                  }}
                />
                <Text
                  className="usa-input-error-message"
                  bind="validationErrors.ownershipDisclosureFile"
                />
                <Text
                  className="usa-input-error-message"
                  bind="validationErrors.ownershipDisclosureFileSize"
                />
              </div>
            </div>
          )}

          <div className="usa-form-group">
            <h2>What Kind of Case Are You Filing?</h2>
            <div className="blue-container">
              <fieldset
                id="irs-notice-radios"
                className={
                  'usa-form-group usa-fieldset-inputs usa-sans ' +
                  (validationErrors.hasIrsNotice ? 'usa-input-error' : '')
                }
              >
                <legend>{startCaseHelper.noticeLegend}</legend>
                <ul className="usa-unstyled-list">
                  {['Yes', 'No'].map((hasIrsNotice, idx) => (
                    <li key={hasIrsNotice}>
                      <input
                        id={`hasIrsNotice-${hasIrsNotice}`}
                        type="radio"
                        name="hasIrsNotice"
                        value={hasIrsNotice === 'Yes'}
                        onChange={e => {
                          updateHasIrsNoticeFormValueSequence({
                            key: e.target.name,
                            value: e.target.value === 'true',
                          });
                          validateStartCaseSequence();
                        }}
                      />
                      <label
                        id={`hasIrsNotice-${idx}`}
                        htmlFor={`hasIrsNotice-${hasIrsNotice}`}
                      >
                        {hasIrsNotice}
                      </label>
                    </li>
                  ))}
                </ul>
                <Text
                  className="usa-input-error-message"
                  bind="validationErrors.hasIrsNotice"
                />
              </fieldset>

              {startCaseHelper.showHasIrsNoticeOptions && (
                <React.Fragment>
                  <CaseTypeSelect
                    caseTypes={caseTypeDescriptionHelper.caseTypes}
                    validation="validateStartCaseSequence"
                    allowDefaultOption={true}
                    onChange="updateFormValueSequence"
                    legend="Type of Notice / Case"
                  />
                  <div
                    className={
                      'usa-form-group ' +
                      (validationErrors.irsNoticeDate ? 'usa-input-error' : '')
                    }
                  >
                    <fieldset>
                      <legend id="date-of-notice-legend">Date of Notice</legend>
                      <div className="usa-date-of-birth">
                        <div className="usa-form-group usa-form-group-month">
                          <label
                            htmlFor="date-of-notice-month"
                            aria-hidden="true"
                          >
                            MM
                          </label>
                          <input
                            className="usa-input-inline"
                            aria-describedby="date-of-notice-legend"
                            id="date-of-notice-month"
                            name="month"
                            aria-label="month, two digits"
                            type="number"
                            min="1"
                            max="12"
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                            }}
                            onBlur={() => {
                              validateStartCaseSequence();
                            }}
                          />
                        </div>
                        <div className="usa-form-group usa-form-group-day">
                          <label
                            htmlFor="date-of-notice-day"
                            aria-hidden="true"
                          >
                            DD
                          </label>
                          <input
                            className="usa-input-inline"
                            aria-describedby="date-of-notice-legend"
                            aria-label="day, two digits"
                            id="date-of-notice-day"
                            name="day"
                            type="number"
                            min="1"
                            max="31"
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                            }}
                            onBlur={() => {
                              validateStartCaseSequence();
                            }}
                          />
                        </div>
                        <div className="usa-form-group usa-form-group-year">
                          <label
                            htmlFor="date-of-notice-year"
                            aria-hidden="true"
                          >
                            YYYY
                          </label>
                          <input
                            className="usa-input-inline"
                            aria-describedby="date-of-notice-legend"
                            aria-label="year, four digits"
                            id="date-of-notice-year"
                            name="year"
                            type="number"
                            min="1900"
                            max="2100"
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                            }}
                            onBlur={() => {
                              validateStartCaseSequence();
                            }}
                          />
                        </div>
                        <Text
                          className="usa-input-error-message"
                          bind="validationErrors.irsNoticeDate"
                        />
                      </div>
                    </fieldset>
                  </div>
                </React.Fragment>
              )}
              {startCaseHelper.showNotHasIrsNoticeOptions && (
                <CaseTypeSelect
                  caseTypes={caseTypeDescriptionHelper.caseTypes}
                  validation="validateStartCaseSequence"
                  onChange="updateFormValueSequence"
                  allowDefaultOption={true}
                  legend="Which topic most closely matches your complaint with the
                IRS?"
                />
              )}
            </div>
          </div>
          <h2>How Do You Want This Case Handled?</h2>
          <p>
            Tax laws allow you to file your case as a “small case,” which means
            it’s handled a bit differently than a regular case. If you choose to
            have your case processed as a small case, the Tax Court must approve
            your choice. Generally, the Tax Court will agree with your request
            if you qualify.
          </p>
          <div className="usa-accordion start-a-case">
            <button
              type="button"
              className="usa-accordion-button case-difference"
              aria-expanded={!!screenMetadata.showCaseDifference}
              aria-controls="case-difference-container"
              onClick={() => toggleCaseDifferenceSequence()}
            >
              <span className="usa-banner-button-text">
                <FontAwesomeIcon icon="question-circle" size="lg" />
                How is a small case different than a regular case, and do I
                qualify?
                {screenMetadata.showCaseDifference ? (
                  <FontAwesomeIcon icon="caret-up" />
                ) : (
                  <FontAwesomeIcon icon="caret-down" />
                )}
              </span>
            </button>
            <div
              id="case-difference-container"
              className="usa-accordion-content"
              aria-hidden={!screenMetadata.showCaseDifference}
            >
              <CaseDifferenceExplained />
            </div>
          </div>
          <div className="blue-container">
            <ProcedureType
              value={form.procedureType}
              onChange={e => {
                updateFormValueSequence({
                  key: 'procedureType',
                  value: e.target.value,
                });
                clearPreferredTrialCitySequence();
                validateStartCaseSequence();
              }}
              legend="Select Case Procedure"
            />
            {startCaseHelper.showSelectTrial && (
              <TrialCity
                showHint={true}
                label="Select a Trial Location"
                showSmallTrialCitiesHint={
                  startCaseHelper.showSmallTrialCitiesHint
                }
                showRegularTrialCitiesHint={
                  startCaseHelper.showRegularTrialCitiesHint
                }
                showDefaultOption={true}
                value={form.preferredTrialCity}
                trialCitiesByState={
                  trialCitiesHelper(form.procedureType).trialCitiesByState
                }
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value || null,
                  });
                  validateStartCaseSequence();
                }}
              />
            )}
            <Text
              className="usa-input-error-message"
              bind="validationErrors.procedureType"
            />
            {!validationErrors.procedureType && (
              <Text
                className="usa-input-error-message"
                bind="validationErrors.preferredTrialCity"
              />
            )}
          </div>
          <h2>Review Your Information</h2>
          <p>
            You can’t edit your case once you submit it. Please make sure all
            your information appears the way you want it to.
          </p>
          <div className="blue-container">
            <h3>Your Case is Ready to Submit If&nbsp;…</h3>
            <ol>
              <li>You have confirmed the timeliness of your Petition.</li>
              <li>
                You have redacted all personal information from your documents.
              </li>
              <li>You have not included any evidence with your Petition.</li>
              <li>
                Your Petition and any IRS notices have been saved and uploaded
                as a single PDF.
              </li>
            </ol>

            <div
              className={
                'ustc-form-group ' +
                (validationErrors.signature ? 'usa-input-error' : '')
              }
            >
              <legend>Review and Sign</legend>
              <input
                id="signature"
                type="checkbox"
                name="signature"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked ? true : undefined,
                  });
                }}
                onBlur={() => {
                  validateStartCaseSequence();
                }}
              />
              <label htmlFor="signature">
                Checking this box acts as your digital signature, acknowledging
                that you’ve verified all information is correct. You won’t be
                able to edit your case once it’s submitted.
              </label>
              <Text
                className="usa-input-error-message"
                bind="validationErrors.signature"
              />
            </div>
          </div>

          <button id="submit-case" type="submit" className="usa-button">
            Submit to U.S. Tax Court
          </button>
          <button
            type="button"
            className="usa-button-secondary"
            onClick={() => {
              formCancelToggleCancelSequence();
            }}
          >
            Cancel
          </button>
        </form>
        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal confirmSequence={submitFilePetitionSequence} />
        )}
      </section>
    );
  },
);
