import { AddDocketEntry } from './AddDocketEntry/AddDocketEntry';
import { AddTrialSession } from './TrialSessions/AddTrialSession';
import { BeforeStartingCase } from './BeforeStartingCase';
import { CaseDetail } from './CaseDetail';
import { CaseDetailInternal } from './CaseDetailInternal';
import { DashboardDocketClerk } from './DashboardDocketClerk';
import { DashboardPetitioner } from './DashboardPetitioner';
import { DashboardPetitionsClerk } from './DashboardPetitionsClerk';
import { DashboardPractitioner } from './DashboardPractitioner';
import { DashboardRespondent } from './DashboardRespondent';
import { DashboardSeniorAttorney } from './DashboardSeniorAttorney';
import { DocumentDetail } from './DocumentDetail';
import { Error } from './Error';
import { FileDocumentWizard } from './FileDocument/FileDocumentWizard';
import { Footer } from './Footer';
import { Header } from './Header';
import { IdleLogout } from './IdleLogout';
import { Interstitial } from './Interstitial';
import { Loading } from './Loading';
import { LogIn } from './LogIn';
import { RequestAccessWizard } from './RequestAccess/RequestAccessWizard';
import { SelectDocumentType } from './FileDocument/SelectDocumentType';
import { SessionDetail } from './SessionDetail/SessionDetail';
import { StartCase } from './StartCase';
import { StartCaseInternal } from './StartCaseInternal';
import { StyleGuide } from './StyleGuide/StyleGuide';
import { TrialSessions } from './TrialSessions/TrialSessions';
import { UsaBanner } from './UsaBanner';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

const pages = {
  AddDocketEntry,
  AddTrialSession,
  BeforeStartingCase,
  CaseDetail,
  CaseDetailInternal,
  DashboardDocketClerk,
  DashboardPetitioner,
  DashboardPetitionsClerk,
  DashboardPractitioner,
  DashboardRespondent,
  DashboardSeniorAttorney,
  DocumentDetail,
  Error,
  FileDocumentWizard,
  IdleLogout,
  Interstitial,
  Loading,
  LogIn,
  RequestAccessWizard,
  SelectDocumentType,
  SessionDetail,
  StartCase,
  StartCaseInternal,
  StyleGuide,
  TrialSessions,
};

/**
 * Root application component
 */
class App extends React.Component {
  componentDidUpdate() {
    this.focusMain();
  }

  focusMain(e) {
    e && e.preventDefault();
    const header = document.querySelector('#main-content h1');
    if (header) header.focus();
    return false;
  }

  render() {
    const CurrentPage = pages[this.props.currentPage];
    return (
      <React.Fragment>
        <a
          tabIndex="0"
          className="usa-skipnav"
          href="#main-content"
          onClick={this.focusMain}
        >
          Skip to main content
        </a>
        <UsaBanner />
        <Header />
        <main id="main-content" role="main">
          <CurrentPage />
        </main>
        <Footer />
        <Loading />
      </React.Fragment>
    );
  }
}

App.propTypes = {
  currentPage: PropTypes.string,
  currentPageHeader: PropTypes.string,
};

export const AppComponent = connect(
  {
    currentPage: state.currentPage,
    currentPageHeader: state.currentPageHeader,
  },
  App,
);
