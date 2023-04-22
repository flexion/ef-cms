import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { DateRangePickerComponent } from '../../ustc-ui/DateInput/DateRangePickerComponent';
import { ErrorNotification } from '../ErrorNotification';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { PaginationerComponent } from '../../ustc-ui/Pagination/PaginationerComponent';
import { SelectSearch } from '../../ustc-ui/Select/SelectSearch';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useState } from 'react';

const ITEMS_PER_PAGE = 10;

export const CustomCaseReport = connect(
  {
    clearOptionalCustomCaseInventoryFilterSequence:
      sequences.clearOptionalCustomCaseInventoryFilterSequence,
    customCaseInventoryFilters: state.customCaseInventoryFilters,
    customCaseInventoryReportHelper: state.customCaseInventoryReportHelper,
    getCustomCaseInventoryReportSequence:
      sequences.getCustomCaseInventoryReportSequence,
    setCustomCaseInventoryReportFiltersSequence:
      sequences.setCustomCaseInventoryReportFiltersSequence,
    validationErrors: state.validationErrors,
  },
  function CustomCaseReport({
    clearOptionalCustomCaseInventoryFilterSequence,
    customCaseInventoryFilters,
    customCaseInventoryReportHelper,
    getCustomCaseInventoryReportSequence,
    setCustomCaseInventoryReportFiltersSequence,
    validationErrors,
  }) {
    const [hasRunCustomCaseReport, setHasRunCustomCaseReport] = useState(false);
    // const [totalCases, setTotalCases] = useState(0);
    const [casesItemOffset, setCaseItemOffset] = useState(0);

    const paginateChange = event => {
      const newOffset =
        (event.selected * ITEMS_PER_PAGE) %
        customCaseInventoryReportHelper.customCaseInventoryReportData.length;
      setCaseItemOffset(newOffset);
    };

    return (
      <>
        <BigHeader text="Reports" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="title">
            <h1>Custom Case Report</h1>
          </div>
          <div className="grid-col-12 blue-container margin-bottom-3">
            <div className="grid-col-auto margin-x-3">
              <DateRangePickerComponent
                endDateErrorText={validationErrors.endDate}
                endLabel="Case created end date"
                endName="caseCreationEndDate"
                endPickerCls={'grid-col-6 padding-left-2'}
                endValue=""
                formGroupCls={'margin-bottom-0'}
                rangePickerCls={'grid-row '}
                startDateErrorText={validationErrors.startDate}
                startLabel="Case created start date"
                startName="caseCreationStartDate"
                startPickerCls={'grid-col-6 padding-right-2'}
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
                // onInputEnd={e => {
                //   setCustomCaseInventoryReportFiltersSequence({
                //     createEndDate: e.target.value,
                //   });
                // }}
                // onInputStart={e => {
                //   setCustomCaseInventoryReportFiltersSequence({
                //     createStartDate: e.target.value,
                //   });
                // }}
              />
            </div>
          </div>
          <div className="grid-col-6 margin-bottom-2">
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
            <div className="grid-row margin-bottom-2">
              <div className="grid-col margin-right-4">
                <label
                  className="usa-label"
                  htmlFor="case-status"
                  id="case-status-label"
                >
                  Case Status (optional)
                </label>
                <SelectSearch
                  aria-labelledby="case-status-label"
                  id="case-status"
                  name="caseStatus"
                  options={customCaseInventoryReportHelper.caseStatuses}
                  value={'Select one or more'}
                  onChange={inputValue => {
                    setCustomCaseInventoryReportFiltersSequence({
                      caseStatuses: {
                        action: 'add',
                        caseStatus: inputValue.value,
                      },
                    });
                  }}
                />
              </div>
              <div className="grid-col">
                <label
                  className="usa-label"
                  htmlFor="case-type"
                  id="case-type-label"
                >
                  Case Types (optional)
                </label>
                <SelectSearch
                  aria-labelledby="case-type-label"
                  id="case-type"
                  name="eventCode"
                  options={customCaseInventoryReportHelper.caseTypes}
                  value="Select one or more"
                  onChange={inputValue => {
                    setCustomCaseInventoryReportFiltersSequence({
                      caseTypes: {
                        action: 'add',
                        caseType: inputValue.value,
                      },
                    });
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid-col-12 margin-bottom-3">
            <div className="grid-row">
              {customCaseInventoryFilters.caseStatuses.map(status => (
                <span className="blue-pill" key={status}>
                  {status}
                  <Icon
                    aria-label={`remove ${status} selection`}
                    className="margin-left-1 cursor-pointer"
                    icon="times"
                    size="1x"
                    onClick={() => {
                      setCustomCaseInventoryReportFiltersSequence({
                        caseStatuses: {
                          action: 'remove',
                          caseStatus: status,
                        },
                      });
                    }}
                  />
                </span>
              ))}

              {customCaseInventoryFilters.caseTypes.map(caseType => {
                return (
                  <span className="blue-pill" key={caseType}>
                    {caseType}
                    <Icon
                      aria-label={`remove ${caseType} selection`}
                      className="margin-left-1 cursor-pointer"
                      icon="times"
                      size="1x"
                      onClick={() => {
                        setCustomCaseInventoryReportFiltersSequence({
                          caseTypes: {
                            action: 'remove',
                            caseType,
                          },
                        });
                      }}
                    />
                  </span>
                );
              })}
            </div>
          </div>
          <Button
            disabled={customCaseInventoryReportHelper.isRunReportButtonDisabled}
            tooltip="Run Report"
            onClick={() => {
              setHasRunCustomCaseReport(true);
              getCustomCaseInventoryReportSequence();
              console.log(
                customCaseInventoryReportHelper.customCaseInventoryReportData
                  .length,
              );
            }}
          >
            Run Report
          </Button>
          <Button
            link
            disabled={customCaseInventoryReportHelper.isClearFiltersDisabled}
            tooltip="Clear Filters"
            onClick={() => clearOptionalCustomCaseInventoryFilterSequence()}
          >
            Clear Filters
          </Button>
          <hr className="margin-top-3 margin-bottom-3 border-top-1px border-base-darker" />
          <PaginationerComponent
            pageCount={Math.ceil(
              customCaseInventoryReportHelper.customCaseInventoryReportData
                .length / ITEMS_PER_PAGE,
            )}
            pageRangeDisplayed={5}
            onPageChange={paginateChange}
          />
          <div className="text-right margin-bottom-2">
            <span className="text-bold">Count: &nbsp;</span>
            {
              customCaseInventoryReportHelper.customCaseInventoryReportData
                .length
            }
          </div>
          <ReportTable
            casesItemOffset={casesItemOffset}
            customCaseInventoryReportData={
              customCaseInventoryReportHelper.customCaseInventoryReportData
            }
            hasRunCustomCaseReport={hasRunCustomCaseReport}
          />
        </section>
      </>
    );
  },
);

const ReportTable = ({
  casesItemOffset,
  customCaseInventoryReportData,
  hasRunCustomCaseReport,
}: {
  casesItemOffset: number;
  customCaseInventoryReportData: any[];
  hasRunCustomCaseReport: boolean;
  updateCount: Function;
}) => {
  const endOffset = casesItemOffset + ITEMS_PER_PAGE;
  const paginatedCases = customCaseInventoryReportData.slice(
    casesItemOffset,
    endOffset,
  );
  return (
    <>
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
        <tbody>
          {paginatedCases &&
            paginatedCases.map(entry => (
              <tr key={`${entry.docketNumber}-${entry.caseCreationEndDate}`}>
                <td>
                  <CaseLink formattedCase={entry} />
                </td>
                <td>{entry.createdAt}</td>
                <td>{entry.caseTitle}</td>
                <td>{entry.status}</td>
                <td>{entry.caseType}</td>
                <td>{entry.associatedJudge}</td>
                <td>{entry.preferredTrialCity}</td>
                <td>
                  {entry.highPriority && (
                    <Icon
                      aria-label={`high priority for calendering for case ${entry.docketNumber}`}
                      className="margin-left-5 mini-success margin-top-1"
                      icon="check"
                      size="1x"
                    />
                  )}
                </td>
              </tr>
            ))}
          {hasRunCustomCaseReport &&
            customCaseInventoryReportData.length === 0 && (
              <tr>
                <div className="text-center">No data found.</div>
              </tr>
            )}
        </tbody>
      </table>
    </>
  );
};

CustomCaseReport.displayName = 'CustomCaseReport';
