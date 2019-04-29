import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

import { CaseSearchBox } from './CaseSearchBox.jsx';

export const CaseListPractitioner = connect(
  {
    caseList: state.formattedCases,
    helper: state.dashboardPetitionerHelper,
  },
  ({ caseList, helper }) => {
    const renderTable = () => (
      <table className="responsive-table dashboard" id="case-list">
        <thead>
          <tr>
            <th>Docket Number</th>
            <th>Case Name</th>
            <th>Date Filed</th>
          </tr>
        </thead>
        <tbody>
          {caseList.map(item => (
            <tr key={item.docketNumber}>
              <td className="hide-on-mobile">
                <a href={'/case-detail/' + item.docketNumber}>
                  {item.docketNumberWithSuffix}
                </a>
              </td>
              <td className="hide-on-mobile">{item.caseName}</td>
              <td>{item.createdAtFormatted}</td>
              <td className="show-on-mobile">
                <div>
                  <a href={'/case-detail/' + item.docketNumber}>
                    {item.docketNumberWithSuffix}
                  </a>
                </div>
                {item.caseName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );

    const renderTitle = () => <h2>Your Cases</h2>;

    const renderStartButton = () => (
      <a
        className={
          'usa-button tablet-full-width ' +
          (helper.showCaseList ? 'new-case' : '')
        }
        href="/start-a-case"
        id="init-file-petition"
      >
        Start a New Case
      </a>
    );

    const renderEmptyState = () => (
      <React.Fragment>
        {renderTitle()}
        <p>You have not started any cases.</p>
        {renderStartButton()}
      </React.Fragment>
    );

    const renderNonEmptyState = () => (
      <React.Fragment>
        <div className="usa-grid-full case-list-header">
          <div className="usa-width-one-half hide-on-mobile">
            <h2>Your Cases</h2>
          </div>
          <div className="usa-width-one-half">{renderStartButton()}</div>
        </div>
        <div className="show-on-mobile">
          <h2>Your Cases</h2>
        </div>
        {renderTable()}
      </React.Fragment>
    );

    return (
      <>
        <div className="usa-grid-full subsection">
          <div className="usa-width-one-third push-right">
            {helper.showCaseSearch && <CaseSearchBox />}
          </div>
          <div className="usa-width-two-thirds">
            {helper.showCaseList ? renderNonEmptyState() : renderEmptyState()}
          </div>
        </div>
      </>
    );
  },
);
