import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { DateRangePickerComponent } from '@web-client/ustc-ui/DateInput/DateRangePickerComponent';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const CaseSearchByName = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    advancedSearchHelper: state.advancedSearchHelper,
    caseSearchByNameHelper: state.caseSearchByNameHelper,
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    updateAdvancedSearchFormValueSequence:
      sequences.updateAdvancedSearchFormValueSequence,
    updateCaseAdvancedSearchByNameFormValueSequence:
      sequences.updateCaseAdvancedSearchByNameFormValueSequence,
    usStates: state.constants.US_STATES,
    usStatesOther: state.constants.US_STATES_OTHER,
    validateCaseAdvancedSearchFormSequence:
      sequences.validateCaseAdvancedSearchFormSequence,
    validateOrderSearchSequence: sequences.validateOrderSearchSequence,
    validationErrors: state.validationErrors,
  },
  function CaseSearchByName({
    advancedSearchForm,
    advancedSearchHelper,
    caseSearchByNameHelper,
    clearAdvancedSearchFormSequence,
    submitAdvancedSearchSequence,
    updateAdvancedSearchFormValueSequence,
    updateCaseAdvancedSearchByNameFormValueSequence,
    usStates,
    usStatesOther,
    validateCaseAdvancedSearchFormSequence,
    validationErrors,
  }) {
    return (
      <>
        <div
          className="header-with-blue-background display-flex flex-justify"
          id="case-search-by-name"
        >
          <h3>Search by Name</h3>
        </div>
        <div className="blue-container advanced-search__form-container">
          <form>
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-12">
                <FormGroup errorText={validationErrors.petitionerName}>
                  <label
                    className="usa-label margin-bottom-0"
                    htmlFor="petitioner-name"
                  >
                    Petitioner name <span className="usa-hint">(required)</span>
                  </label>
                  <span className="usa-hint">
                    Advanced syntax search (*, “”, - , etc. ) is not supported
                    at this time.
                  </span>
                  <input
                    aria-describedby="case-search-by-name"
                    className="usa-input"
                    data-testid="petitioner-name"
                    id="petitioner-name"
                    name="petitionerName"
                    type="text"
                    value={
                      advancedSearchForm.caseSearchByName.petitionerName || ''
                    }
                    onBlur={() => {
                      validateCaseAdvancedSearchFormSequence();
                    }}
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'caseSearchByName',
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </FormGroup>
              </div>
            </div>
            {/* TODO: CHANGE IDS AND OTHER ATTRIBUTES FOR NEW INPUTS*/}
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-12">
                <div className="grid-row grid-gap">
                  <FormGroup className="margin-bottom-0" errorText="">
                    <fieldset
                      aria-label="scan mode selection"
                      className={classNames('usa-fieldset margin-bottom-3')}
                      id="scan-mode-radios"
                    >
                      <legend
                        className="usa-legend with-hint margin-bottom-2"
                        id="scan-mode-radios-legend"
                      >
                        Country
                      </legend>
                      <div className="usa-radio usa-radio__inline">
                        <input
                          aria-describedby="all-country-selection"
                          aria-labelledby="all-country-selection"
                          checked={
                            advancedSearchForm.caseSearchByName.countryType ===
                            'all'
                          }
                          className="usa-radio__input"
                          data-testid="all-country-selection"
                          id="all-country-selection"
                          name="all"
                          type="radio"
                          value="All"
                          onChange={e => {
                            updateCaseAdvancedSearchByNameFormValueSequence({
                              key: 'countryType',
                              value: e.target.name,
                            });
                          }}
                        />
                        <label
                          className="usa-radio__label"
                          htmlFor="all-country-selection"
                          id="all-country-selection-label"
                        >
                          All
                        </label>
                      </div>

                      <div className="usa-radio usa-radio__inline">
                        <input
                          aria-describedby="scan-mode-radios-legend"
                          aria-labelledby="upload-mode-upload"
                          checked={
                            advancedSearchForm.caseSearchByName.countryType ===
                            'domestic'
                          }
                          className="usa-radio__input"
                          id="united-states-country-selection"
                          name="domestic"
                          type="radio"
                          value="United States"
                          onChange={e => {
                            updateCaseAdvancedSearchByNameFormValueSequence({
                              key: 'countryType',
                              value: e.target.name,
                            });
                          }}
                        />
                        <label
                          className="usa-radio__label"
                          htmlFor="united-states-country-selection"
                          id="united-states-country-selection-label"
                        >
                          United States
                        </label>
                      </div>

                      <div className="usa-radio usa-radio__inline">
                        <input
                          aria-describedby="scan-mode-radios-legend"
                          aria-labelledby="upload-mode-upload"
                          checked={
                            advancedSearchForm.caseSearchByName.countryType ===
                            'international'
                          }
                          className="usa-radio__input"
                          id="international-country-selection"
                          name="international"
                          type="radio"
                          value="international"
                          onChange={e => {
                            updateCaseAdvancedSearchByNameFormValueSequence({
                              key: 'countryType',
                              value: e.target.name,
                            });
                          }}
                        />
                        <label
                          className="usa-radio__label"
                          htmlFor="international-country-selection"
                          id="international-country-selection-label"
                        >
                          International
                        </label>
                      </div>
                    </fieldset>
                  </FormGroup>

                  {advancedSearchHelper.showStateSelect && (
                    <div className="tablet:grid-col-5">
                      <label className="usa-label" htmlFor="petitioner-state">
                        State
                      </label>
                      <BindedSelect
                        aria-describedby="case-search-by-name"
                        bind="advancedSearchForm.caseSearchByName.petitionerState"
                        id="petitioner-state"
                        name="petitionerState"
                      >
                        <option value="">- Select -</option>
                        <optgroup label="State">
                          {Object.keys(usStates).map(abbrev => {
                            return (
                              <option key={abbrev} value={abbrev}>
                                {usStates[abbrev]}
                              </option>
                            );
                          })}
                        </optgroup>
                        <optgroup label="Other">
                          {Object.keys(usStatesOther).map(abbrev => {
                            return (
                              <option key={abbrev} value={abbrev}>
                                {usStatesOther[abbrev]}
                              </option>
                            );
                          })}
                        </optgroup>
                      </BindedSelect>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid-row grid-gap margin-top-4 margin-bottom-2">
              <DateRangePickerComponent
                omitFormGroupClass
                endDateErrorText={validationErrors.endDate}
                endLabel="Date filed end date"
                endName="caseSearchByNameEndDate"
                endPickerCls={
                  'desktop:grid-col-6  phone:grid-col-12 desktop:padding-left-2'
                }
                endValue={advancedSearchForm.caseSearchByName.endDate}
                formGroupCls={'margin-bottom-0'}
                maxDate={caseSearchByNameHelper.today}
                rangePickerCls={'grid-row grid-gap-3'}
                showDateHint={true}
                startDateErrorText={validationErrors.startDate}
                startLabel="Date filed start date"
                startName="caseSearchByNameStartDate"
                startPickerCls={
                  'desktop:grid-col-6  phone:grid-col-12 padding-right-2'
                }
                startValue={advancedSearchForm.caseSearchByName.startDate}
                onChangeEnd={e => {
                  updateCaseAdvancedSearchByNameFormValueSequence({
                    key: 'endDate',
                    value: e.target.value,
                  });
                }}
                onChangeStart={e => {
                  updateCaseAdvancedSearchByNameFormValueSequence({
                    key: 'startDate',
                    value: e.target.value,
                  });
                }}
              />
            </div>

            <div className="grid-row">
              <div className="tablet:grid-col-6">
                <Button
                  aria-describedby="case-search-by-name"
                  className="advanced-search__button"
                  data-testid="case-search-by-name"
                  id="advanced-search-button"
                  onClick={e => {
                    e.preventDefault();
                    submitAdvancedSearchSequence();
                  }}
                >
                  Search
                </Button>
                <Button
                  link
                  aria-describedby="case-search-by-name"
                  className="margin-left-1 tablet:margin-left-205 margin-right-0 padding-0 ustc-button--mobile-inline"
                  data-testid="clear-search-by-name"
                  onClick={e => {
                    e.preventDefault();
                    clearAdvancedSearchFormSequence({
                      formType: 'caseSearchByName',
                    });
                  }}
                >
                  Clear Search
                </Button>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  },
);

CaseSearchByName.displayName = 'CaseSearchByName';
