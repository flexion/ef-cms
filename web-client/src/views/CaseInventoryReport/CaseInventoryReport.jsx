import { BigHeader } from '../BigHeader';
import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseInventoryReport = connect(
  {
    caseInventoryReportHelper: state.caseInventoryReportHelper,
    caseInventoryReportLoadMoreSequence:
      sequences.caseInventoryReportLoadMoreSequence,
    getCaseInventoryReportSequence: sequences.getCaseInventoryReportSequence,
    gotoPrintableCaseInventoryReportSequence:
      sequences.gotoPrintableCaseInventoryReportSequence,
    screenMetadata: state.screenMetadata,
  },
  ({
    caseInventoryReportHelper,
    caseInventoryReportLoadMoreSequence,
    getCaseInventoryReportSequence,
    gotoPrintableCaseInventoryReportSequence,
    screenMetadata,
  }) => {
    return (
      <>
        <BigHeader text="Reports" />
        <section className="usa-section grid-container">
          <div className="title">
            <h1>Case Inventory</h1>

            <Button
              link
              className="float-right margin-right-0"
              icon="print"
              onClick={() => gotoPrintableCaseInventoryReportSequence()}
            >
              Printable Report
            </Button>
          </div>

          <div className="grid-row grid-gap-2 padding-top-3 padding-bottom-1">
            <div className="grid-col-1 padding-top-05">
              <h3 id="filterHeading">Filter by</h3>
            </div>
            <div className="grid-col-2">
              <BindedSelect
                ariaDescribedBy="filterHeading"
                ariaLabel="judge"
                bind="screenMetadata.associatedJudge"
                className="select-left"
                id="judgeFilter"
                name="associatedJudge"
                value={screenMetadata.associatedJudge}
                onChange={() => getCaseInventoryReportSequence()}
              >
                <option value="">- Judge -</option>
                {caseInventoryReportHelper.judges.map((judge, idx) => (
                  <option key={idx} value={judge}>
                    {judge}
                  </option>
                ))}
              </BindedSelect>
            </div>
            <div className="grid-col-2">
              <BindedSelect
                ariaDescribedBy="filterHeading"
                ariaLabel="status"
                bind="screenMetadata.status"
                className="select-left"
                id="statusFilter"
                name="status"
                value={screenMetadata.status}
                onChange={() => getCaseInventoryReportSequence()}
              >
                <option value="">- Status -</option>
                {caseInventoryReportHelper.caseStatuses.map(status => {
                  return (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  );
                })}
              </BindedSelect>
            </div>
          </div>

          <div className="grid-row grid-gap margin-top-1">
            <div className="grid-col-12 text-align-right">
              <span className="text-semibold">Count:</span>{' '}
              {caseInventoryReportHelper.resultCount}
            </div>
          </div>

          <div className="grid-row grid-gap margin-top-1">
            <div className="grid-col-12">
              <table className="usa-table row-border-only subsection work-queue deadlines">
                <thead>
                  <tr>
                    <th>Docket</th>
                    <th>Case title</th>
                    {caseInventoryReportHelper.showJudgeColumn && (
                      <th>Judge</th>
                    )}
                    {caseInventoryReportHelper.showStatusColumn && (
                      <th>Case status</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {caseInventoryReportHelper.formattedReportData.map(
                    (row, idx) => (
                      <tr key={idx}>
                        <td>
                          <CaseLink formattedCase={row} />
                        </td>
                        <td>{row.caseName}</td>
                        {caseInventoryReportHelper.showJudgeColumn && (
                          <td>{row.associatedJudge}</td>
                        )}
                        {caseInventoryReportHelper.showStatusColumn && (
                          <td>{row.status}</td>
                        )}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
              {caseInventoryReportHelper.showLoadMoreButton && (
                <Button onClick={() => caseInventoryReportLoadMoreSequence()}>
                  Load {caseInventoryReportHelper.nextPageSize} More
                </Button>
              )}
            </div>
          </div>
        </section>
      </>
    );
  },
);
