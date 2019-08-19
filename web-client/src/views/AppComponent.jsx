import { AddDocketEntry } from './AddDocketEntry/AddDocketEntry';
import { AddTrialSession } from './TrialSessions/AddTrialSession';
import { BeforeStartingCase } from './BeforeStartingCase';
import { BeforeYouFileADocument } from './FileDocument/BeforeYouFileADocument';
import { CaseDetail } from './CaseDetail';
import { CaseDetailInternal } from './CaseDetailInternal';
import { CreateOrder } from './CreateOrder/CreateOrder';
import { DashboardDocketClerk } from './Dashboards/DashboardDocketClerk';
import { DashboardJudge } from './Dashboards/DashboardJudge';
import { DashboardPetitioner } from './Dashboards/DashboardPetitioner';
import { DashboardPetitionsClerk } from './Dashboards/DashboardPetitionsClerk';
import { DashboardPractitioner } from './Dashboards/DashboardPractitioner';
import { DashboardRespondent } from './Dashboards/DashboardRespondent';
import { DashboardSeniorAttorney } from './Dashboards/DashboardSeniorAttorney';
import { DocumentDetail } from './DocumentDetail';
import { Error } from './Error';
import { FileDocumentWizard } from './FileDocument/FileDocumentWizard';
import { Footer } from './Footer';
import { Header } from './Header';
import { IdleLogout } from './IdleLogout';
import { Interstitial } from './Interstitial';
import { Loading } from './Loading';
import { LogIn } from './LogIn';
import { MessagesJudge } from './Messages/MessagesJudge';
import { PDFSigner } from './PDFSigner';
import { PrimaryContactEdit } from './PrimaryContactEdit';
import { PrintableDocketRecord } from './DocketRecord/PrintableDocketRecord';
import { RequestAccessWizard } from './RequestAccess/RequestAccessWizard';
import { SelectDocumentType } from './FileDocument/SelectDocumentType';
import { StartCaseInternal } from './StartCaseInternal';
import { StartCaseWizard } from './StartCase/StartCaseWizard';
import { StyleGuide } from './StyleGuide/StyleGuide';
import { TrialSessionDetail } from './TrialSessionDetail/TrialSessionDetail';
import { TrialSessionWorkingCopy } from './TrialSessionWorkingCopy/TrialSessionWorkingCopy';
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
  BeforeYouFileADocument,
  CaseDetail,
  CaseDetailInternal,
  CreateOrder,
  DashboardDocketClerk,
  DashboardJudge,
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
  MessagesJudge,
  PDFSigner,
  PrimaryContactEdit,
  PrintableDocketRecord,
  RequestAccessWizard,
  SelectDocumentType,
  StartCaseInternal,
  StartCaseWizard,
  StyleGuide,
  TrialSessionDetail,
  TrialSessionWorkingCopy,
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
          className="usa-skipnav"
          href="#main-content"
          tabIndex="0"
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
