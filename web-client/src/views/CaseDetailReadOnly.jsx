import { CaseDetailReadOnlyPartyInformation } from './CaseDetailReadOnlyPartyInformation';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseDetailReadOnly = connect(
  {
    caseDetail: state.formattedCaseDetail,
    caseDetailErrors: state.caseDetailErrors,
    formattedCaseDetail: state.formattedCaseDetail,
  },
  ({ caseDetail, formattedCaseDetail }) => {
    return (
      <React.Fragment>
        <CaseDetailReadOnlyPartyInformation />

        <div className="blue-container">
          <h3>IRS Notice(s)</h3>

          <span className="label">Notice/Case Type</span>
          <p>{caseDetail.caseType}</p>

          <div className="label">Notice Date</div>
          <p>{formattedCaseDetail.irsNoticeDateFormatted}</p>
          <div>
            {formattedCaseDetail.yearAmountsFormatted.map((yearAmount, idx) => (
              <div key={idx}>
                <div className="inline-input-year">
                  <div className="label">Year</div>
                  <p>{yearAmount.year}</p>
                </div>
                <div className="inline-input-amount">
                  <div className="label">Amount</div>
                  <p>
                    <span aria-hidden="true" role="presentation">
                      $
                    </span>
                    <span
                      aria-label="IRS Notice Amount in whole dollars"
                      id="amount"
                    />
                    {yearAmount.amountFormatted}
                    <span aria-hidden="true" role="presentation">
                      .00
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="blue-container">
          <h3>Case Information</h3>
          <div className="label">Case Procedure</div>
          <p>{caseDetail.procedureType} Tax Case</p>
          <div className="label">Trial Location</div>
          <p>{caseDetail.preferredTrialCity}</p>
          <div className="label">Fee Payment Date</div>
          <p>{caseDetail.payGovDateFormatted || 'Unpaid'}</p>
          <div className="label">Fee Payment ID</div>
          <p id="fee-payment-id" name="payGovId">
            {caseDetail.payGovId || 'Unpaid'}
          </p>
        </div>
      </React.Fragment>
    );
  },
);
