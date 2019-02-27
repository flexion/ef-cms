import React from 'react';

import { connect } from '@cerebral/react';
import { state } from 'cerebral';

export default connect(
  {
    caseDetail: state.formattedCaseDetail,
  },
  function PartyInformation({ caseDetail }) {
    return (
      <div className="subsection party-information">
        <h3 className="underlined">Party Information</h3>
        <div className="usa-grid-full">
          <div className="usa-width-one-sixth">
            <p className="label">Party Type</p>
            <p>{caseDetail.partyType || 'My Party Type'}</p>
          </div>

          <div className="usa-width-one-sixth">
            {caseDetail.contactPrimary && (
              <React.Fragment>
                <p className="label" id="primary-label">
                  Primary Contact
                </p>
                <div>
                  <address aria-labelledby="primary-label">
                    <p>{caseDetail.contactPrimary.name}</p>
                    <p>{caseDetail.contactPrimary.nameOfDecedent}</p>
                    <p>
                      <span className="address-line">
                        {caseDetail.contactPrimary.address1}
                      </span>
                      <span className="address-line">
                        {caseDetail.contactPrimary.address2}
                      </span>
                      {caseDetail.contactPrimary.address3 && (
                        <span className="address-line">
                          {caseDetail.contactPrimary.address3}
                        </span>
                      )}
                      <span className="address-line">
                        {caseDetail.contactPrimary.city},{' '}
                        {caseDetail.contactPrimary.state}{' '}
                        {caseDetail.contactPrimary.zip}
                      </span>
                    </p>
                    {caseDetail.contactPrimary.phone && (
                      <p>{caseDetail.contactPrimary.phone}</p>
                    )}
                    <p>{caseDetail.contactPrimary.email}</p>
                  </address>
                </div>
              </React.Fragment>
            )}{' '}
          </div>
          <div className="usa-width-one-sixth">
            <p className="label" id="secondary-label">
              Secondary Contact
            </p>
            {caseDetail.contactSecondary && (
              <React.Fragment>
                <div>
                  <address aria-labelledby="secondary-label">
                    <p>{caseDetail.contactSecondary.name}</p>
                    <p>
                      <span className="address-line">
                        {caseDetail.contactSecondary.address1}
                      </span>
                      <span className="address-line">
                        {caseDetail.contactSecondary.address2}
                      </span>
                      <span className="address-line">
                        {caseDetail.contactSecondary.city &&
                          `${caseDetail.contactSecondary.city},`}{' '}
                        {caseDetail.contactSecondary.state}{' '}
                        {caseDetail.contactSecondary.zip}
                      </span>
                    </p>
                    <p>{caseDetail.contactSecondary.phone}</p>
                    <p>{caseDetail.contactSecondary.email}</p>
                  </address>
                </div>
              </React.Fragment>
            )}{' '}
          </div>

          <div className="usa-width-one-sixth">
            {caseDetail.respondent && (
              <React.Fragment>
                <p className="label" id="respondent-label">
                  Respondent Information
                </p>
                <address aria-labelledby="respondent-label">
                  <p>{caseDetail.respondent.formattedName}</p>
                  <p>
                    <span className="address-line">
                      {caseDetail.respondent.addressLine1}
                    </span>
                    <span className="address-line">
                      {caseDetail.respondent.addressLine2}
                    </span>
                    <span className="address-line">
                      {caseDetail.respondent.city},{' '}
                      {caseDetail.respondent.state} {caseDetail.respondent.zip}
                    </span>
                  </p>
                  <p>{caseDetail.respondent.phone}</p>
                  <p>{caseDetail.respondent.email}</p>
                </address>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    );
  },
);
