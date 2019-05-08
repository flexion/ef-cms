import { CaseListPetitioner } from './CaseListPetitioner';
import { ErrorNotification } from './ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SuccessNotification } from './SuccessNotification';
import { WhatToExpect } from './WhatToExpect';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import howToPrepareYourDocuments from '../pdfs/how-to-prepare-your-documents.pdf';

export const DashboardPetitioner = connect(
  { helper: state.dashboardPetitionerHelper, user: state.user },
  ({ user, helper }) => {
    return (
      <section className="usa-section grid-container">
        <h1 tabIndex="-1">Welcome, {user.name}</h1>
        <SuccessNotification />
        <ErrorNotification />
        <div className="grid-row">
          <div className="grid-col-8">
            {helper.showWhatToExpect && <WhatToExpect />}
            {helper.showCaseList && <CaseListPetitioner />}
          </div>
          <div className="grid-col-4">
            <div className="blue-container">
              <h3>Taxpayer Tools</h3>
              <p>
                <FontAwesomeIcon icon="file-pdf" size="sm" />
                <a
                  href={howToPrepareYourDocuments}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  How to prepare your documents before filing a case
                </a>
              </p>
              <p>
                <a
                  href="https://www.ustaxcourt.gov/dpt_cities.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Find a court location
                </a>
                <FontAwesomeIcon
                  icon="share-square"
                  size="sm"
                  className="fa-icon-blue"
                />
              </p>
              <p>
                <a
                  href="https://www.ustaxcourt.gov/forms.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View forms
                </a>
                <FontAwesomeIcon
                  icon="share-square"
                  size="sm"
                  className="fa-icon-blue"
                />
              </p>
            </div>
            <div className="blue-container">
              <h3>Other Filing Options</h3>
              <p>
                <a href="/" target="_blank" rel="noopener noreferrer">
                  How to file a case by mail or in person
                </a>
                <FontAwesomeIcon
                  icon="share-square"
                  size="sm"
                  className="fa-icon-blue"
                />
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  },
);
