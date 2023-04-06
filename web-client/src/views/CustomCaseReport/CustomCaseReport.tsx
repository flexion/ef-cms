import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import {
  CASE_STATUSES,
  CASE_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { DateRangePickerComponent } from '../../ustc-ui/DateInput/DateRangePickerComponent';
import { ErrorNotification } from '../ErrorNotification';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const CustomCaseReport = connect(
  {
    customCaseInventoryFilters: state.customCaseInventoryFilters,
    customCaseInventoryReportHelper: state.customCaseInventoryReportHelper,
    getCustomCaseInventoryReportSequence:
      sequences.getCustomCaseInventoryReportSequence,
    setCustomCaseInventoryReportFiltersSequence:
      sequences.setCustomCaseInventoryReportFiltersSequence,
  },
  function CustomCaseReport({
    customCaseInventoryFilters,
    customCaseInventoryReportHelper,
    getCustomCaseInventoryReportSequence,
    setCustomCaseInventoryReportFiltersSequence,
  }) {
    return (
      <>
        <BigHeader text="Reports" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="title">
            <h1>Custom Case Report</h1>
          </div>
          <div className="grid-col-4">
            <DateRangePickerComponent
              endDateOptional={false}
              endLabel="Case created end date"
              endName="caseCreationEndDate"
              endValue=""
              orientation="horizontal"
              startDateOptional={false}
              startLabel="Case created start date"
              startName="caseCreationStartDate"
              startValue=""
              onChangeEnd={e => {
                setCustomCaseInventoryReportFiltersSequence({
                  createEndDate: e.target.value,
                });
              }}
              onChangeStart={e => {
                setCustomCaseInventoryReportFiltersSequence({
                  createStartDate: e.target.value,
                });
              }}
            />
          </div>
          <div className="grid-col-6">
            <legend>Petition Filing Method</legend>
            <div className="usa-radio usa-radio__inline">
              <input
                aria-describedby="petition-filing-method-radios"
                checked={customCaseInventoryFilters.filingMethod === 'all'}
                className="usa-radio__input"
                id="petitionFilingMethod-all"
                name="filingMethod"
                type="radio"
                onChange={() => {
                  setCustomCaseInventoryReportFiltersSequence({
                    filingMethod: 'all',
                  });
                }}
              />
              <label
                className="usa-radio__label"
                htmlFor="petitionFilingMethod-all"
              >
                All
              </label>
            </div>
            <div className="usa-radio usa-radio__inline">
              <input
                aria-describedby="petition-filing-method-radios"
                checked={
                  customCaseInventoryFilters.filingMethod === 'electronic'
                }
                className="usa-radio__input"
                id="petitionFilingMethod-electronic"
                name="filingMethod"
                type="radio"
                onChange={() => {
                  setCustomCaseInventoryReportFiltersSequence({
                    filingMethod: 'electronic',
                  });
                }}
              />
              <label
                className="usa-radio__label"
                htmlFor="petitionFilingMethod-electronic"
              >
                Electronic
              </label>
            </div>
            <div className="usa-radio usa-radio__inline">
              <input
                aria-describedby="petition-filing-method-radios"
                checked={customCaseInventoryFilters.filingMethod === 'paper'}
                className="usa-radio__input"
                id="petitionFilingMethod-paper"
                name="filingMethod"
                type="radio"
                onChange={() => {
                  setCustomCaseInventoryReportFiltersSequence({
                    filingMethod: 'paper',
                  });
                }}
                // onChange={handleChange}
              />
              <label
                className="usa-radio__label"
                htmlFor="petitionFilingMethod-paper"
              >
                Paper
              </label>
            </div>
          </div>
          <div className="grid-col-8">
            <div className="grid-row">
              <div className="grid-col margin-top-3 margin-right-4">
                <legend className="display-block" id="trial-year">
                  Case Status
                </legend>
                <select
                  aria-label="Case Status"
                  className={classNames('usa-select')}
                  name="caseStatus"
                  onChange={e => {
                    setCustomCaseInventoryReportFiltersSequence({
                      caseStatuses: {
                        action: 'add',
                        caseStatus: e.target.value,
                      },
                    });
                    // validateTrialSessionPlanningSequence();
                  }}
                >
                  <option value="">- Select one or more -</option>
                  {CASE_STATUSES.map(caseStatus => (
                    <option key={caseStatus} value={caseStatus}>
                      {caseStatus}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid-col margin-top-3">
                <legend className="display-block" id="trial-year">
                  Case Types
                </legend>
                <select
                  aria-label="Case Types"
                  className={classNames('usa-select')}
                  name="caseTypes"
                  onChange={e => {
                    setCustomCaseInventoryReportFiltersSequence({
                      caseTypes: {
                        action: 'add',
                        caseType: e.target.value,
                      },
                    });
                    // validateTrialSessionPlanningSequence();
                  }}
                >
                  <option value="">- Select one or more -</option>
                  {CASE_TYPES.map(caseType => (
                    <option key={caseType} value={caseType}>
                      {caseType}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid-col-12 margin-top-3 margin-bottom-3">
            <div className="grid-row">
              {customCaseInventoryFilters.caseStatuses.map(status => (
                <span className="blue-pill" key={status}>
                  {status}
                  <Icon
                    aria-label={`remove ${status} selection`}
                    className="margin-right-3"
                    icon="copy"
                    size="1x"
                    onClick={() => {
                      setCustomCaseInventoryReportFiltersSequence({
                        caseStatuses: {
                          action: 'remove',
                          caseStatus: status,
                        },
                      });
                      // validateTrialSessionPlanningSequence();
                    }}
                  />{' '}
                </span>
              ))}
              {customCaseInventoryFilters.caseTypes.map(caseType => (
                <span className="blue-pill" key={caseType}>
                  {caseType}
                  <Icon
                    aria-label={`remove ${caseType} selection`}
                    className="margin-right-3"
                    icon="copy"
                    size="1x"
                    onClick={() => {
                      setCustomCaseInventoryReportFiltersSequence({
                        caseTypes: {
                          action: 'remove',
                          caseStatus: caseType,
                        },
                      });
                      // validateTrialSessionPlanningSequence();
                    }}
                  />{' '}
                </span>
              ))}
            </div>
          </div>
          <Button
            isActive={customCaseInventoryReportHelper.isRunReportButtonActive}
            tooltip="Run Report"
            onClick={() => getCustomCaseInventoryReportSequence()}
          >
            Run Report
          </Button>
          <Button
            link
            isActive={customCaseInventoryReportHelper.isClearFiltersActive}
            tooltip="Clear Filters"
            // onClick={() =>
            //   setCustomCaseInventoryReportFiltersSequence({
            //     resetFilters: true, //DISCUSS BETTER APPROACH
            //   })
            // }
          >
            Clear Filters
          </Button>
          <hr className="margin-top-3 margin-bottom-3 border-top-1px border-base-darker" />
          <div className="text-right margin-bottom-3">
            {`Count: ${
              (customCaseInventoryReportHelper.customCaseInventoryReportData &&
                customCaseInventoryReportHelper.customCaseInventoryReportData
                  .totalCount) ||
              0
            }`}
          </div>
          <ReportTable
            customCaseInventoryReportData={
              customCaseInventoryReportHelper.customCaseInventoryReportData
            }
          />
        </section>
      </>
    );
  },
);

const ReportTable = ({ customCaseInventoryReportData }) => {
  return (
    <table
      aria-label="case inventory record"
      className="usa-table case-detail ustc-table responsive-table"
      id="docket-record-table"
    >
      <thead>
        <tr>
          <th>Docket No.</th>
          <th>Date Created</th>
          <th>Case Title</th>
          <th>Case Status</th>
          <th>Case Type</th>
          <th>Judge</th>
          <th>Request Place of Trial</th>
          <th>High Priority for calendaring</th>
        </tr>
      </thead>
      {customCaseInventoryReportData &&
        customCaseInventoryReportData.foundCases && (
          <tbody>
            {customCaseInventoryReportData.foundCases.map(entry => (
              <tr key={`${entry.docketNumber}-${entry.caseCreationEndDate}`}>
                <td>{entry.docketNumber}</td>
                <td>{entry.createdAt}</td>
                <td>PLACEHOLDER</td>
                <td>{entry.status}</td>
                <td>{entry.caseType}</td>
                <td>{entry.associatedJudge}</td>
                <td>{entry.preferredTrialCity}</td>
                <td>PLACEHOLDER</td>
              </tr>
            ))}
          </tbody>
        )}
    </table>
  );
};

CustomCaseReport.displayName = 'CustomCaseReport';
