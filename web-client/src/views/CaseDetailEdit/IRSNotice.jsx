import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import { CaseTypeSelect } from '../StartCase/CaseTypeSelect';

export const IRSNotice = connect(
  {
    appendNewYearAmountSequence: sequences.appendNewYearAmountSequence,
    autoSaveCaseSequence: sequences.autoSaveCaseSequence,
    caseDetail: state.caseDetail,
    caseDetailErrors: state.caseDetailErrors,
    caseTypes: state.caseTypes,
    form: state.form,
    formattedCaseDetail: state.formattedCaseDetail,
    removeYearAmountSequence: sequences.removeYearAmountSequence,
    setIrsNoticeFalseSequence: sequences.setIrsNoticeFalseSequence,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({
    appendNewYearAmountSequence,
    autoSaveCaseSequence,
    caseDetail,
    caseTypes,
    caseDetailErrors,
    form,
    formattedCaseDetail,
    removeYearAmountSequence,
    updateCaseValueSequence,
    updateFormValueSequence,
    setIrsNoticeFalseSequence,
  }) => {
    const renderIrsNoticeRadios = () => {
      return (
        <div className="subsection">
          <fieldset className="usa-fieldset" id="irs-verified-notice-radios">
            <legend htmlFor="irs-verified-notice-radios">
              Notice Attached to Petition?
            </legend>
            <div className="usa-radio usa-radio__inline">
              <input
                className="usa-radio__input"
                id="hasVerifiedIrsNotice-yes"
                type="radio"
                name="hasVerifiedIrsNotice"
                checked={caseDetail.hasVerifiedIrsNotice === true}
                value="Yes"
                onChange={e => {
                  updateCaseValueSequence({
                    key: e.target.name,
                    value: true,
                  });
                  autoSaveCaseSequence();
                }}
              />
              <label
                id="has-irs-verified-notice-yes"
                htmlFor="hasVerifiedIrsNotice-yes"
                className="usa-radio__label"
              >
                Yes
              </label>
            </div>
            <div className="usa-radio usa-radio__inline">
              <input
                className="usa-radio__input"
                id="hasVerifiedIrsNotice-no"
                type="radio"
                name="hasVerifiedIrsNotice"
                checked={caseDetail.hasVerifiedIrsNotice === false}
                value="No"
                onChange={() => {
                  setIrsNoticeFalseSequence();
                  autoSaveCaseSequence();
                }}
              />
              <label
                id="has-irs-verified-notice-no"
                htmlFor="hasVerifiedIrsNotice-no"
                className="usa-radio__label"
              >
                No
              </label>
            </div>
          </fieldset>
        </div>
      );
    };

    const renderIrsNoticeDate = () => {
      return (
        <div className="subsection">
          <div
            className={
              'usa-form-group ' +
              (caseDetailErrors.irsNoticeDate ? 'usa-form-group--error' : '')
            }
          >
            <fieldset className="usa-fieldset">
              <legend id="date-of-notice-legend" className="usa-legend">
                Date of Notice
              </legend>
              <div className="usa-memorable-date">
                <div className="usa-form-group usa-form-group--month">
                  <label
                    htmlFor="date-of-notice-month"
                    className="usa-label"
                    aria-hidden="true"
                  >
                    MM
                  </label>
                  <input
                    aria-describedby="date-of-notice-legend"
                    aria-label="month, two digits"
                    className={
                      'usa-input usa-input--inline ' +
                      (caseDetailErrors.irsNoticeDate ? 'usa-input--error' : '')
                    }
                    id="date-of-notice-month"
                    max="12"
                    min="1"
                    name="irsMonth"
                    type="number"
                    value={form.irsMonth || ''}
                    onBlur={() => {
                      autoSaveCaseSequence();
                    }}
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group--day">
                  <label
                    htmlFor="date-of-notice-day"
                    aria-hidden="true"
                    className="usa-label"
                  >
                    DD
                  </label>
                  <input
                    aria-describedby="date-of-notice-legend"
                    aria-label="day, two digits"
                    className={
                      'usa-input usa-input--inline ' +
                      (caseDetailErrors.irsNoticeDate ? 'usa-input--error' : '')
                    }
                    id="date-of-notice-day"
                    max="31"
                    min="1"
                    name="irsDay"
                    type="number"
                    value={form.irsDay || ''}
                    onBlur={() => {
                      autoSaveCaseSequence();
                    }}
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group--year">
                  <label
                    htmlFor="date-of-notice-year"
                    aria-hidden="true"
                    className="usa-label"
                  >
                    YYYY
                  </label>
                  <input
                    aria-describedby="date-of-notice-legend"
                    aria-label="year, four digits"
                    className={
                      'usa-input usa-input--inline ' +
                      (caseDetailErrors.irsNoticeDate ? 'usa-input--error' : '')
                    }
                    id="date-of-notice-year"
                    max="2100"
                    min="1900"
                    name="irsYear"
                    type="number"
                    value={form.irsYear || ''}
                    onBlur={() => {
                      autoSaveCaseSequence();
                    }}
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </fieldset>
            {caseDetailErrors.irsNoticeDate && (
              <div className="usa-error-message" role="alert">
                {caseDetailErrors.irsNoticeDate}
              </div>
            )}
          </div>
        </div>
      );
    };

    const renderYearAmounts = () => {
      return (
        <React.Fragment>
          {formattedCaseDetail.yearAmountsFormatted.map((yearAmount, idx) => (
            <div
              key={idx}
              className={yearAmount.showError ? ' usa-input-error' : ''}
            >
              <div className="inline-input-year">
                <label htmlFor="year" className="usa-label">
                  Year
                </label>
                <input
                  aria-label="IRS Notice Year"
                  className="usa-input"
                  id="year"
                  name="year"
                  type="number"
                  value={yearAmount.year || ''}
                  onChange={e => {
                    updateCaseValueSequence({
                      key: `yearAmounts.${idx}.year`,
                      value: e.target.value,
                    });
                  }}
                  onBlur={() => {
                    autoSaveCaseSequence();
                  }}
                />
              </div>
              <div className="inline-input-amount">
                <label htmlFor="amount" className="usa-label">
                  Amount
                </label>
                <span aria-hidden="true" role="presentation">
                  $
                </span>
                <input
                  aria-label="IRS Notice Amount in whole dollars"
                  className="usa-input"
                  id="amount"
                  name="amount"
                  type="text"
                  value={Number(yearAmount.amount || 0).toLocaleString('en-US')}
                  onChange={e => {
                    updateCaseValueSequence({
                      key: `yearAmounts.${idx}.amount`,
                      value: e.target.value.replace(/\D/g, ''),
                    });
                  }}
                  onBlur={() => {
                    autoSaveCaseSequence();
                  }}
                />
                <span aria-hidden="true" role="presentation">
                  .00
                </span>
                {idx !== 0 && (
                  <button
                    className="usa-button usa-button--unstyled"
                    type="button"
                    aria-controls="removeYearAmount"
                    onClick={e => {
                      e.preventDefault();
                      removeYearAmountSequence({
                        index: idx,
                      });
                    }}
                  >
                    <span>
                      <FontAwesomeIcon icon="times-circle" size="sm" />
                      Remove
                    </span>
                  </button>
                )}
              </div>
              {yearAmount.showError && (
                <div className="usa-error-message">
                  {yearAmount.errorMessage}
                </div>
              )}
            </div>
          ))}
          <button
            className="usa-button usa-button--unstyled"
            type="button"
            aria-controls="addAnotherYearAmount"
            disabled={!formattedCaseDetail.canAddYearAmount}
            onClick={e => {
              e.preventDefault();
              appendNewYearAmountSequence();
            }}
          >
            <span>
              <FontAwesomeIcon icon="plus-circle" size="sm" />
              Add Another
            </span>
          </button>
        </React.Fragment>
      );
    };

    return (
      <div className="blue-container">
        {renderIrsNoticeRadios()}

        <CaseTypeSelect
          allowDefaultOption={true}
          legend="Type of Case"
          onChange="updateCaseValueSequence"
          validation="autoSaveCaseSequence"
          value={caseDetail.caseType}
          caseTypes={caseTypes}
        />

        {formattedCaseDetail.shouldShowIrsNoticeDate && renderIrsNoticeDate()}
        {formattedCaseDetail.shouldShowYearAmounts && (
          <React.Fragment>
            <hr />
            {renderYearAmounts()}
          </React.Fragment>
        )}
      </div>
    );
  },
);
