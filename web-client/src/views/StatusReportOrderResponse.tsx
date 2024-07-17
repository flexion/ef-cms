import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetail/CaseDetailHeader';
import { CharactersRemainingHint } from '@web-client/ustc-ui/CharactersRemainingHint/CharactersRemainingHint';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { ErrorNotification } from './ErrorNotification';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { PdfPreview } from '@web-client/ustc-ui/PdfPreview/PdfPreview';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const StatusReportOrderResponse = connect(
  {
    clearStatusReportOrderResponseFormSequence:
      sequences.clearStatusReportOrderResponseFormSequence,
    constants: state.constants,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    navigateBackSequence: sequences.navigateBackSequence,
    statusReportOrderResponseHelper: state.statusReportOrderResponseHelper,
    statusReportOrderResponsePdfPreviewSequence:
      sequences.statusReportOrderResponsePdfPreviewSequence,
    submitStatusReportOrderResponseSequence:
      sequences.submitStatusReportOrderResponseSequence,
    updateFormValueSequence:
      sequences.updateStatusReportOrderResponseFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function StatusReportOrderResponse({
    clearStatusReportOrderResponseFormSequence,
    constants,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    navigateBackSequence,
    statusReportOrderResponseHelper,
    statusReportOrderResponsePdfPreviewSequence,
    submitStatusReportOrderResponseSequence,
    updateFormValueSequence,
    validationErrors,
  }) {
    return (
      <>
        <CaseDetailHeader />
        <div className="grid-container">
          <ErrorNotification />
          <div className="grid-row grid-gap">
            <h1 className="heading-1" id="page-title">
              Status Report Order Response
            </h1>
          </div>
          <div className="grid-row grid-gap">
            <div className="grid-col-5">
              <div className="border border-base-lighter">
                <div className="grid-header grid-row padding-left-205">
                  Select one or more options:
                </div>
                <div className="status-report-order-response-form margin-top-2">
                  {statusReportOrderResponseHelper.isLeadCase && (
                    <>
                      <FormGroup
                        className="status-report-order-response-form-group"
                        errorText={validationErrors.issueOrder}
                      >
                        <label
                          className="usa-label"
                          htmlFor="issue-order-radios"
                        >
                          This is the lead case in a consolidateed group. Issue
                          this order in:
                        </label>
                        <div className="usa-radio usa-radio">
                          <input
                            aria-describedby="issue-order-radios"
                            aria-label="all cases in group"
                            checked={
                              form.issueOrder ===
                              constants.STATUS_REPORT_ORDER_RESPONSE_OPTIONS
                                .issueOrderOptions.allCasesInGroup
                            }
                            className="usa-radio__input"
                            id="all-cases-in-group"
                            name="issueOrder"
                            type="radio"
                            value={
                              constants.STATUS_REPORT_ORDER_RESPONSE_OPTIONS
                                .issueOrderOptions.allCasesInGroup
                            }
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor="all-cases-in-group"
                          >
                            All cases in this group
                          </label>
                        </div>
                        <div className="usa-radio">
                          <input
                            aria-describedby="issue-order-radios"
                            aria-label="just this case"
                            checked={
                              form.issueOrder ===
                              constants.STATUS_REPORT_ORDER_RESPONSE_OPTIONS
                                .issueOrderOptions.justThisCase
                            }
                            className="usa-radio__input"
                            id="just-this-case"
                            name="issueOrder"
                            type="radio"
                            value={
                              constants.STATUS_REPORT_ORDER_RESPONSE_OPTIONS
                                .issueOrderOptions.justThisCase
                            }
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor="just-this-case"
                          >
                            Just this case
                          </label>
                        </div>
                      </FormGroup>
                      <hr className="border-top-2px border-base-lighter" />
                    </>
                  )}

                  <FormGroup
                    className="status-report-order-response-form-group"
                    errorText={validationErrors.orderType}
                  >
                    <label className="usa-label" htmlFor="order-type-radios">
                      Order type
                    </label>
                    <div className="usa-radio">
                      <input
                        aria-describedby="order-type-radios"
                        aria-label="status report"
                        checked={
                          form.orderType ===
                          constants.STATUS_REPORT_ORDER_RESPONSE_OPTIONS
                            .orderTypeOptions.statusReport
                        }
                        className="usa-radio__input"
                        id="order-type-status-report"
                        name="orderType"
                        type="radio"
                        value={
                          constants.STATUS_REPORT_ORDER_RESPONSE_OPTIONS
                            .orderTypeOptions.statusReport
                        }
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor="order-type-status-report"
                      >
                        Status Report
                      </label>
                    </div>

                    <div className="usa-radio">
                      <input
                        aria-describedby="order-type-radios"
                        aria-label="status report or stipulated decision"
                        checked={
                          form.orderType ===
                          constants.STATUS_REPORT_ORDER_RESPONSE_OPTIONS
                            .orderTypeOptions.stipulatedDecision
                        }
                        className="usa-radio__input"
                        id="order-type-or-stipulated-decision"
                        name="orderType"
                        type="radio"
                        value={
                          constants.STATUS_REPORT_ORDER_RESPONSE_OPTIONS
                            .orderTypeOptions.stipulatedDecision
                        }
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor="order-type-or-stipulated-decision"
                      >
                        Status Report or Stipulated Decision
                      </label>
                    </div>
                  </FormGroup>

                  <FormGroup
                    className={
                      statusReportOrderResponseHelper.dueDateErrorClass
                    }
                    errorText={statusReportOrderResponseHelper.dueDateErrorText}
                    id="status-report-due-date-form-group"
                  >
                    <DateSelector
                      defaultValue={form.dueDate}
                      disabled={!form.orderType}
                      formGroupClassNames="display-inline-block padding-0"
                      id="status-report-due-date"
                      label="Due date"
                      minDate={statusReportOrderResponseHelper.minDate}
                      placeHolderText="MM/DD/YYYY"
                      onChange={e => {
                        formatAndUpdateDateFromDatePickerSequence({
                          key: 'dueDate',
                          toFormat: constants.DATE_FORMATS.YYYYMMDD,
                          value: e.target.value,
                        });
                      }}
                    />
                  </FormGroup>

                  <hr className="border-top-2px border-base-lighter" />

                  <FormGroup
                    className="grid-container padding-left-2"
                    errorText={validationErrors.strickenFromTrialSessions}
                    id="stricken-from-trial-sessions-form-group"
                  >
                    <div>
                      <input
                        checked={form.strickenFromTrialSessions || false}
                        className="usa-checkbox__input"
                        id="stricken-from-trial-sessions"
                        name="strickenFromTrialSessions"
                        type="checkbox"
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.checked,
                          });
                        }}
                      />
                      <label
                        className="usa-checkbox__label"
                        htmlFor="stricken-from-trial-sessions"
                        id="stricken-from-trial-sessions-label"
                      >
                        Case is striken from the trial sessions
                      </label>
                    </div>
                  </FormGroup>

                  <hr className="border-top-2px border-base-lighter" />

                  <FormGroup
                    className={
                      statusReportOrderResponseHelper.jurisdictionErrorClass
                    }
                    errorText={
                      statusReportOrderResponseHelper.jurisdictionErrorText
                    }
                    id="jurisdiction-form-group"
                  >
                    <label className="usa-label" htmlFor="jurisdiction-radios">
                      Jurisdiction
                    </label>
                    <div className="usa-radio">
                      <input
                        aria-describedby="jurisdiction-radios"
                        aria-label="retained"
                        checked={
                          form.jurisdiction ===
                          constants.STATUS_REPORT_ORDER_RESPONSE_OPTIONS
                            .jurisdictionOptions.retained
                        }
                        className="usa-radio__input"
                        disabled={!form.strickenFromTrialSessions}
                        id="jurisdiction-retained"
                        name="jurisdiction"
                        type="radio"
                        value={
                          constants.STATUS_REPORT_ORDER_RESPONSE_OPTIONS
                            .jurisdictionOptions.retained
                        }
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor="jurisdiction-retained"
                      >
                        Retained
                      </label>
                    </div>
                    <div className="usa-radio">
                      <input
                        aria-describedby="jurisdiction-radios"
                        aria-label="restored to general docket"
                        checked={
                          form.jurisdiction ===
                          constants.STATUS_REPORT_ORDER_RESPONSE_OPTIONS
                            .jurisdictionOptions.restored
                        }
                        className="usa-radio__input"
                        disabled={!form.strickenFromTrialSessions}
                        id="jurisdiction-restored-to-general-docket"
                        name="jurisdiction"
                        type="radio"
                        value={
                          constants.STATUS_REPORT_ORDER_RESPONSE_OPTIONS
                            .jurisdictionOptions.restored
                        }
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor="jurisdiction-restored-to-general-docket"
                      >
                        Restored to the general docket
                      </label>
                    </div>
                  </FormGroup>

                  <hr className="border-top-2px border-base-lighter" />

                  <FormGroup
                    className="status-report-order-response-form-group"
                    errorText={validationErrors.additionalOrderText}
                  >
                    <div>
                      <label
                        className="usa-label"
                        htmlFor="additional-order-text"
                        id="additional-order-text-label"
                      >
                        Additional order text
                      </label>
                      <textarea
                        aria-describedby="additional-order-text-label"
                        aria-label="additional order text"
                        autoCapitalize="none"
                        className="usa-textarea maxw-none height-8 usa-character-count__field"
                        id="additional-order-text"
                        maxLength={80}
                        name="additionalOrderText"
                        value={form.additionalOrderText}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      ></textarea>
                      <CharactersRemainingHint
                        maxCharacters={80}
                        stringToCount={form.additionalOrderText}
                      />
                    </div>
                  </FormGroup>

                  <hr className="border-top-2px border-base-lighter" />

                  <FormGroup
                    className="status-report-order-response-form-group"
                    errorText={validationErrors.docketEntryDescription}
                    id="docket-entry-description-form-group"
                  >
                    <div>
                      <label
                        className="usa-label"
                        htmlFor="docket-entry-description"
                        id="docket-entry-description-label"
                      >
                        Docket entry description
                      </label>
                      <textarea
                        aria-describedby="docket-entry-description-label"
                        aria-label="docket entry description"
                        autoCapitalize="none"
                        className="usa-textarea maxw-none height-8 usa-character-count__field"
                        id="docket-entry-description"
                        maxLength={80}
                        name="docketEntryDescription"
                        value={form.docketEntryDescription}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      ></textarea>
                      <CharactersRemainingHint
                        maxCharacters={80}
                        stringToCount={form.docketEntryDescription}
                      />
                    </div>
                  </FormGroup>
                </div>
              </div>
              <Button
                link
                data-testid="clear-optional-fields"
                onClick={e => {
                  e.preventDefault();
                  clearStatusReportOrderResponseFormSequence();
                }}
              >
                Clear All
              </Button>

              <div className="margin-bottom-2 margin-top-2">
                <Button
                  className="margin-right-1"
                  data-testid="save-draft-button"
                  id="save-draft-button"
                  onClick={() => submitStatusReportOrderResponseSequence()}
                >
                  Save as Draft
                </Button>

                <Button
                  secondary
                  className="margin-right-1"
                  data-testid="preview-pdf-button"
                  id="preview-pdf-button"
                  onClick={() => {
                    statusReportOrderResponsePdfPreviewSequence();
                  }}
                >
                  Preview PDF
                </Button>

                <Button link onClick={() => navigateBackSequence()}>
                  Cancel
                </Button>
              </div>
            </div>
            <div className="grid-col-7">
              <div>
                <span className="text-bold">Docket entry preview:</span>{' '}
                {form.docketEntryDescription}
              </div>
              <div
                className="statusReportOrderResponsePdfPreview"
                data-testid="status-report-order-response-pdf-preview"
              >
                <PdfPreview />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);
