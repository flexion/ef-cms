import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseInformationInternal = connect(
  {
    helper: state.caseDetailHelper,
    caseDetail: state.formattedCaseDetail,
  },
  ({ helper, caseDetail }) => {
    return (
      <div className="subsection internal-information">
        <div className="usa-grid-full">
          <div className="usa-width-one-half">
            <h3 className="underlined">Petition Details</h3>
            <div className="usa-grid-full">
              <div className="usa-width-one-third">
                <p className="label">Notice/Case Type</p>
                <p>{caseDetail.caseType}</p>
                <p className="label">IRS Notice Date</p>
                <p id="irs-notice-date">{caseDetail.irsNoticeDateFormatted}</p>
              </div>
              <div className="usa-width-one-third">
                <p className="label">Case Procedure</p>
                <p>{caseDetail.procedureType}</p>
              </div>
              <div className="usa-width-one-third">
                {helper.showPaymentRecord && (
                  <React.Fragment>
                    <p className="label">Petition Fee Paid</p>
                    <p id="pay-gov-id-display">{caseDetail.payGovId}</p>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
          <div className="usa-width-one-half">
            <h3 className="underlined">Trial Information</h3>
            <div className="usa-width-one-third">
              <p className="label">Place of Trial</p>
              <p>{caseDetail.preferredTrialCity}</p>
              <p className="label">Assigned Judge</p>
              <p>Not assigned</p>
            </div>
            <div className="usa-width-one-third">
              <p className="label">Trial Date</p>
              <p>Not scheduled</p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
