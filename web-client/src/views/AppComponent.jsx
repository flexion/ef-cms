import { BeforeStartingCase } from './BeforeStartingCase';
import { CaseDetail } from './CaseDetail';
import { CaseDetailInternal } from './CaseDetailInternal';
import { DashboardDocketClerk } from './DashboardDocketClerk';
import { DashboardIntakeClerk } from './DashboardIntakeClerk';
import { DashboardPetitioner } from './DashboardPetitioner';
import { DashboardPetitionsClerk } from './DashboardPetitionsClerk';
import { DashboardPractitioner } from './DashboardPractitioner';
import { DashboardRespondent } from './DashboardRespondent';
import { DashboardSeniorAttorney } from './DashboardSeniorAttorney';
import { DocumentDetail } from './DocumentDetail';
import { Error } from './Error';
import { FileDocument } from './FileDocument/FileDocument';
import { Footer } from './Footer';
import { Header } from './Header';
import { Interstitial } from './Interstitial';
import { Loading } from './Loading';
import { LogIn } from './LogIn';
import { SelectDocumentType } from './FileDocument/SelectDocumentType';
import { StartCase } from './StartCase';
import { StartCaseInternal } from './StartCaseInternal';
import { StyleGuide } from './StyleGuide/StyleGuide';
import { UsaBanner } from './UsaBanner';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

const pages = {
  BeforeStartingCase,
  CaseDetail,
  CaseDetailInternal,
  DashboardDocketClerk,
  DashboardIntakeClerk,
  DashboardPetitioner,
  DashboardPetitionsClerk,
  DashboardPractitioner,
  DashboardRespondent,
  DashboardSeniorAttorney,
  DocumentDetail,
  Error,
  FileDocument,
  Interstitial,
  Loading,
  LogIn,
  SelectDocumentType,
  StartCase,
  StartCaseInternal,
  StyleGuide,
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
};

export const AppComponent = connect(
  {
    currentPage: state.currentPage,
  },
  App,
);
