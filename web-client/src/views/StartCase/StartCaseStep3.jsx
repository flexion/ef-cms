import { Contacts } from './Contacts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const StartCaseStep3 = connect(
  {
    completeStartCaseWizardStepSequence:
      sequences.completeStartCaseWizardStepSequence,
    constants: state.constants,
    filingTypes: state.filingTypes,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    startCaseHelper: state.startCaseHelper,
    updateStartCaseFormValueSequence:
      sequences.updateStartCaseFormValueSequence,
    validateStartCaseWizardSequence: sequences.validateStartCaseWizardSequence,
    validationErrors: state.validationErrors,
  },
  ({
    completeStartCaseWizardStepSequence,
    constants,
    filingTypes,
    form,
    formCancelToggleCancelSequence,
    startCaseHelper,
    updateStartCaseFormValueSequence,
    validateStartCaseWizardSequence,
    validationErrors,
  }) => {
    return (
      <>
        <h1 className="margin-top-5">
          3. Who are you filing this petition for?
        </h1>
        <p className="required-statement margin-top-05 margin-bottom-2">
          All fields required unless otherwise noted
        </p>
        <div className="blue-container grid-container padding-x-0">
          <div className="grid-row grid-gap">
            <div className="mobile-lg:grid-col-5">
              <div
                className={
                  validationErrors.filingType ? 'usa-form-group--error' : ''
                }
              >
                <fieldset
                  className="usa-fieldset usa-sans"
                  id="filing-type-radios"
                >
                  <legend htmlFor="filing-type-radios">
                    I am filing this petition on behalf of …
                  </legend>
                  {filingTypes.map((filingType, idx) => (
                    <div className="usa-radio" key={filingType}>
                      <input
                        checked={form.filingType === filingType}
                        className="usa-radio__input"
                        data-type={filingType}
                        id={filingType}
                        name="filingType"
                        type="radio"
                        value={filingType}
                        onChange={e => {
                          updateStartCaseFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                          validateStartCaseWizardSequence();
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor={filingType}
                        id={`filing-type-${idx}`}
                      >
                        {filingType}
                      </label>
                    </div>
                  ))}
                  <Text
                    bind="validationErrors.partyType"
                    className="usa-error-message"
                  />
                </fieldset>
              </div>
            </div>
          </div>

          {startCaseHelper.showPetitionerDeceasedSpouseForm && (
            <div
              className={
                'ustc-secondary-question ' +
                (validationErrors.partyType ? 'usa-form-group--error' : '')
              }
            >
              <fieldset
                className="usa-fieldset usa-sans"
                id="deceased-spouse-radios"
              >
                <legend htmlFor="deceased-spouse-radios">
                  {startCaseHelper.deceasedSpouseLegend}
                </legend>
                {['Yes', 'No'].map((isSpouseDeceased, idx) => (
                  <div
                    className="usa-radio usa-radio__inline"
                    key={isSpouseDeceased}
                  >
                    <input
                      checked={
                        form.isSpouseDeceased === (isSpouseDeceased === 'Yes')
                      }
                      className="usa-radio__input"
                      id={`isSpouseDeceased-${isSpouseDeceased}`}
                      name="isSpouseDeceased"
                      type="radio"
                      value={isSpouseDeceased}
                      onChange={e => {
                        updateStartCaseFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validateStartCaseWizardSequence();
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      htmlFor={`isSpouseDeceased-${isSpouseDeceased}`}
                      id={`is-spouse-deceased-${idx}`}
                    >
                      {isSpouseDeceased}
                    </label>
                  </div>
                ))}
              </fieldset>
            </div>
          )}
          {startCaseHelper.showBusinessFilingTypeOptions && (
            <div
              className={
                'ustc-secondary-question ' +
                (validationErrors.partyType ? 'usa-form-group--error' : '')
              }
            >
              <fieldset className="usa-fieldset" id="business-type-radios">
                <legend htmlFor="business-type-radios">
                  What type of business are you filing for?
                </legend>
                {[
                  constants.BUSINESS_TYPES.corporation,
                  constants.BUSINESS_TYPES.partnershipAsTaxMattersPartner,
                  constants.BUSINESS_TYPES.partnershipOtherThanTaxMatters,
                  constants.BUSINESS_TYPES.partnershipBBA,
                ].map((businessType, idx) => (
                  <div className="usa-radio" key={businessType}>
                    <input
                      checked={form.businessType === businessType}
                      className="usa-radio__input"
                      id={`businessType-${businessType}`}
                      name="businessType"
                      type="radio"
                      value={businessType}
                      onChange={e => {
                        updateStartCaseFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validateStartCaseWizardSequence();
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      htmlFor={`businessType-${businessType}`}
                      id={`is-business-type-${idx}`}
                    >
                      {businessType}
                    </label>
                  </div>
                ))}
              </fieldset>
            </div>
          )}
          {startCaseHelper.showOtherFilingTypeOptions && (
            <div
              className={
                'ustc-secondary-question ' +
                (validationErrors.partyType ? 'usa-form-group--error' : '')
              }
            >
              <fieldset className="usa-fieldset" id="other-type-radios">
                <legend htmlFor="other-type-radios">
                  What other type of taxpayer are you filing for?
                </legend>
                {[
                  'An estate or trust',
                  'A minor or legally incompetent person',
                  'Donor',
                  'Transferee',
                  'Deceased Spouse',
                ].map((otherType, idx) => (
                  <div className="usa-radio" key={otherType}>
                    <input
                      checked={form.otherType === otherType}
                      className="usa-radio__input"
                      id={`otherType-${otherType}`}
                      name="otherType"
                      type="radio"
                      value={otherType}
                      onChange={e => {
                        updateStartCaseFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validateStartCaseWizardSequence();
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      htmlFor={`otherType-${otherType}`}
                      id={`is-other-type-${idx}`}
                    >
                      {otherType}
                    </label>
                  </div>
                ))}
              </fieldset>
            </div>
          )}
          {startCaseHelper.showOtherFilingTypeOptions &&
            startCaseHelper.showEstateFilingOptions && (
              <div
                className={
                  'ustc-secondary-question ' +
                  (validationErrors.partyType ? 'usa-form-group--error' : '')
                }
              >
                <fieldset
                  className="usa-fieldset usa-sans"
                  id="estate-type-radios"
                >
                  <legend htmlFor="estate-type-radios">
                    What type of estate or trust are you filing for?
                  </legend>
                  {[
                    constants.ESTATE_TYPES.estate,
                    constants.ESTATE_TYPES.estateWithoutExecutor,
                    constants.ESTATE_TYPES.trust,
                  ].map((estateType, idx) => (
                    <div className="usa-radio" key={estateType}>
                      <input
                        checked={form.estateType === estateType}
                        className="usa-radio__input"
                        id={`estateType-${estateType}`}
                        name="estateType"
                        type="radio"
                        value={estateType}
                        onChange={e => {
                          updateStartCaseFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                          validateStartCaseWizardSequence();
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor={`estateType-${estateType}`}
                        id={`is-estate-type-${idx}`}
                      >
                        {estateType}
                      </label>
                    </div>
                  ))}
                </fieldset>
              </div>
            )}
          {startCaseHelper.showOtherFilingTypeOptions &&
            startCaseHelper.showMinorIncompetentFilingOptions && (
              <div
                className={
                  'ustc-secondary-question ' +
                  (validationErrors.partyType ? 'usa-form-group--error' : '')
                }
              >
                <fieldset
                  className="usa-fieldset"
                  id="minorIncompetent-type-radios"
                >
                  <legend htmlFor="minorIncompetent-type-radios">
                    {startCaseHelper.minorIncompetentLegend}
                  </legend>
                  {[
                    constants.OTHER_TYPES.conservator,
                    constants.OTHER_TYPES.guardian,
                    constants.OTHER_TYPES.custodian,
                    constants.OTHER_TYPES.nextFriendForMinor,
                    constants.OTHER_TYPES.nextFriendForIncompetentPerson,
                  ].map((minorIncompetentType, idx) => (
                    <div className="usa-radio" key={minorIncompetentType}>
                      <input
                        checked={
                          form.minorIncompetentType === minorIncompetentType
                        }
                        className="usa-radio__input"
                        id={`minorIncompetentType-${minorIncompetentType}`}
                        name="minorIncompetentType"
                        type="radio"
                        value={minorIncompetentType}
                        onChange={e => {
                          updateStartCaseFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                          validateStartCaseWizardSequence();
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor={`minorIncompetentType-${minorIncompetentType}`}
                        id={`is-minorIncompetent-type-${idx}`}
                      >
                        {minorIncompetentType}
                      </label>
                    </div>
                  ))}
                </fieldset>
              </div>
            )}
        </div>

        <Contacts
          bind="form"
          contactsHelper="contactsHelper"
          emailBind="user"
          parentView="StartCase"
          showPrimaryContact={startCaseHelper.showPrimaryContact}
          showSecondaryContact={startCaseHelper.showSecondaryContact}
          onBlur="validateStartCaseWizardSequence"
          onChange="updateFormValueSequence"
        />

        {startCaseHelper.showOwnershipDisclosure && (
          <>
            <h2 className="margin-top-4">Ownership Disclosure Statement</h2>
            <p>
              Tax Court Rules of Practice and Procedure (Rule 60) requires a
              corporation, partnership, or limited liability company, filing a
              Petition with the Court to also file an Ownership Disclosure
              Statement (ODS). Complete your{' '}
              <a
                href="https://www.ustaxcourt.gov/forms/Ownership_Disclosure_Statement_Form_6.pdf"
                rel="noopener noreferrer"
                target="_blank"
              >
                Ownership Disclosure Statement Form 6
              </a>
              .
            </p>
            <div className="blue-container">
              <label
                className={
                  'ustc-upload-ods usa-label with-hint ' +
                  (startCaseHelper.showOwnershipDisclosureValid
                    ? 'validated'
                    : '')
                }
                htmlFor="ownership-disclosure-file"
                id="ownership-disclosure-file-label"
              >
                Upload your Ownership Disclosure Statement
                <span className="success-message">
                  <FontAwesomeIcon icon="check-circle" size="1x" />
                </span>
              </label>
              <span className="usa-hint">
                File must be in PDF format (.pdf). Max file size{' '}
                {constants.MAX_FILE_SIZE_MB}MB.
              </span>
              <StateDrivenFileInput
                aria-describedby="ownership-disclosure-file-label"
                id="ownership-disclosure-file"
                name="ownershipDisclosureFile"
                updateFormValueSequence="updateStartCaseFormValueSequence"
                validationSequence="validateStartCaseWizardSequence"
              />
              <Text
                bind="validationErrors.ownershipDisclosureFile"
                className="usa-error-message"
              />
              <Text
                bind="validationErrors.ownershipDisclosureFileSize"
                className="usa-error-message"
              />
            </div>
          </>
        )}

        <div className="button-box-container">
          <button
            className="usa-button margin-right-205 margin-bottom-4"
            id="submit-case"
            type="button"
            onClick={() => {
              completeStartCaseWizardStepSequence({ nextStep: 4 });
            }}
          >
            Continue to Step 4 of 5
          </button>
          <button
            className="usa-button usa-button--outline margin-bottom-1"
            type="button"
            onClick={() => history.back()}
          >
            Back
          </button>
          <button
            className="usa-button usa-button--unstyled ustc-button--unstyled"
            type="button"
            onClick={() => {
              formCancelToggleCancelSequence();
            }}
          >
            Cancel
          </button>
        </div>
      </>
    );
  },
);
