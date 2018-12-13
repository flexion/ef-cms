import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import React from 'react';

import ErrorNotification from './ErrorNotification';
import openDocumentBlob from './openDocumentBlob';
import SuccessNotification from './SuccessNotification';
import PartyInformation from './PartyInformation';

export default connect(
  {
    caseDetail: state.formattedCaseDetail,
    currentTab: state.currentTab,
    submitSendToIrsSequence: sequences.submitToIrsSequence,
    submitUpdateCaseSequence: sequences.submitUpdateCaseSequence,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
    updateCurrentTabSequence: sequences.updateCurrentTabSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    viewDocumentSequence: sequences.viewDocumentSequence,
  },
  function CaseDetail({
    caseDetail,
    currentTab,
    submitUpdateCaseSequence,
    submitSendToIrsSequence,
    updateCaseValueSequence,
    updateCurrentTabSequence,
    updateFormValueSequence,
    viewDocumentSequence,
  }) {
    return (
      <React.Fragment>
        <div className="usa-grid breadcrumb">
          <FontAwesomeIcon icon="caret-left" />
          <a href="/" id="queue-nav">
            Back to dashboard
          </a>
        </div>
        <section className="usa-section usa-grid">
          <h1 tabIndex="-1">Docket number: {caseDetail.docketNumber}</h1>
          <p>
            {caseDetail.petitioners[0].name} v. Commissioner of Internal Revenue, Respondent
          </p>
          <p>
            <span className="usa-label case-status-label">
              {caseDetail.status}
            </span>
          </p>
          <hr />
          <SuccessNotification />
          <ErrorNotification />
          <nav className="horizontal-tabs">
            <ul role="tabslist">
              <li
                role="presentation"
                className={currentTab == 'Docket Record' ? 'active' : ''}
              >
                <button
                  role="tab"
                  className="tab-link"
                  onClick={() =>
                    updateCurrentTabSequence({ value: 'Docket Record' })
                  }
                  id="docket-record-tab"
                >
                  Docket Record
                </button>
              </li>
              <li className={currentTab == 'Case Information' ? 'active' : ''}>
                <button
                  role="tab"
                  className="tab-link"
                  id="case-info-tab"
                  onClick={() =>
                    updateCurrentTabSequence({ value: 'Case Information' })
                  }
                >
                  Case Information
                </button>
              </li>
            </ul>
          </nav>
          {currentTab == 'Docket Record' && (
            <div className="tab-content" role="tabpanel">
              {!caseDetail.showIrsServedDate && (
                <button
                  id="send-to-irs"
                  onClick={() => submitSendToIrsSequence()}
                >
                  Send to IRS
                </button>
              )}
              <table className="responsive-table">
                <thead>
                  <tr>
                    <th>Date filed</th>
                    <th>Title</th>
                    <th>Filed by</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {caseDetail.documents.map((document, idx) => (
                    <tr key={idx}>
                      <td className="responsive-title">
                        <span className="responsive-label">Activity date</span>
                        {document.createdAtFormatted}
                      </td>
                      <td>
                        <span className="responsive-label">Title</span>
                        <button
                          className="pdf-link"
                          aria-label="View PDF"
                          onClick={() =>
                            viewDocumentSequence({
                              documentId: document.documentId,
                              callback: openDocumentBlob,
                            })
                          }
                        >
                          <FontAwesomeIcon icon="file-pdf" />
                          {document.documentType}
                        </button>
                      </td>
                      <td>
                        <span className="responsive-label">Filed by</span>
                        {document.filedBy}
                      </td>
                      <td>
                        <span className="responsive-label">Status</span>
                        {document.isStatusServed && (
                          <span>{caseDetail.datePetitionSentToIrsMessage}</span>
                        )}
                        {caseDetail.showDocumentStatus && (
                          <span>{document.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {caseDetail.showPaymentRecord && (
                    <tr>
                      <td>{caseDetail.payGovDateFormatted}</td>
                      <td>Filing fee paid</td>
                      <td />
                      <td />
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {currentTab == 'Case Information' && (
            <div className="tab-content" role="tabpanel">
              <PartyInformation />
              <div>
                <fieldset className="usa-fieldset-inputs usa-sans">
                  <legend>Petition fee</legend>
                  {caseDetail.showPaymentRecord && (
                    <React.Fragment>
                      <p className="label">Paid by pay.gov</p>
                      <p>{caseDetail.payGovId}</p>
                    </React.Fragment>
                  )}
                  {caseDetail.showPaymentOptions && (
                    <ul className="usa-unstyled-list">
                      <li>
                        <input
                          id="paygov"
                          type="radio"
                          name="paymentType"
                          value="payGov"
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                          }}
                        />
                        <label htmlFor="paygov">Paid by pay.gov</label>
                        {caseDetail.showPayGovIdInput && (
                          <React.Fragment>
                            <label htmlFor="paygovid">Payment ID</label>
                            <input
                              id="paygovid"
                              type="text"
                              name="payGovId"
                              value={caseDetail.payGovId || ''}
                              onChange={e => {
                                updateCaseValueSequence({
                                  key: e.target.name,
                                  value: e.target.value,
                                });
                              }}
                            />
                            <button
                              id="update-case-page-end"
                              onClick={() => submitUpdateCaseSequence()}
                            >
                              Save updates
                            </button>
                          </React.Fragment>
                        )}
                      </li>
                    </ul>
                  )}
                </fieldset>
              </div>
            </div>
          )}
        </section>
      </React.Fragment>
    );
  },
);
