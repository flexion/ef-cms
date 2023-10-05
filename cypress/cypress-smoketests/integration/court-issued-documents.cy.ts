import { AuthenticationResult } from '../../support/login-types';
import {
  addDocketEntryForOrderAndSaveForLater,
  addDocketEntryForOrderAndServePaper,
  addDocketEntryForUploadedPdfAndServe,
  addDocketEntryForUploadedPdfAndServePaper,
  clickSaveUploadedPdfButton,
  createOrder,
  editAndSignOrder,
  goToCaseDetail,
  reviewAndServePetition,
  serveCourtIssuedDocketEntry,
  uploadCourtIssuedDocPdf,
} from '../support/pages/case-detail';
import {
  completeWizardStep1,
  completeWizardStep2,
  completeWizardStep3,
  completeWizardStep4,
  filingTypes,
  goToDashboard,
  goToStartCreatePetition,
  goToWizardStep1,
  goToWizardStep2,
  goToWizardStep3,
  goToWizardStep4,
  goToWizardStep5,
  hasIrsNotice,
  submitPetition,
} from '../support/pages/create-electronic-petition';
import { faker } from '@faker-js/faker';
import { fillInCreateCaseFromPaperForm } from '../../cypress-integration/support/pages/create-paper-petition';
import { getEnvironmentSpecificFunctions } from '../support/pages/environment-specific-factory';
import {
  goToCreateCase,
  goToReviewCase,
  serveCaseToIrs,
} from '../support/pages/create-paper-case';
import { goToMyDocumentQC } from '../support/pages/document-qc';

let token: string;
const testData = {};

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');

const { closeScannerSetupDialogIfExists, login } =
  getEnvironmentSpecificFunctions();
let createdPaperDocketNumber: string;

describe('Petitioner', () => {
  before(() => {
    cy.task<AuthenticationResult>('getUserToken', {
      email: 'petitioner1@example.com',
      password: DEFAULT_ACCOUNT_PASS,
    }).then(result => {
      token = result.AuthenticationResult.IdToken;
    });
  });

  it('should be able to login', () => {
    login(token);
  });

  describe('should be able to create a case', () => {
    it('should complete wizard step 1', () => {
      goToStartCreatePetition();
      goToWizardStep1();
      completeWizardStep1();
    });

    // this is in its own step because sometimes the click fails, and if it's in its own step it will retry properly
    it('should go to wizard step 2', () => {
      goToWizardStep2();
    });

    it('should complete the form and submit the petition', () => {
      completeWizardStep2(hasIrsNotice.NO, 'Innocent Spouse');
      goToWizardStep3();
      completeWizardStep3(
        filingTypes.INDIVIDUAL,
        `${faker.person.firstName()} ${faker.person.lastName()}`,
      );
      goToWizardStep4();
      completeWizardStep4();
      goToWizardStep5();
      submitPetition(testData);
      goToDashboard();
    });
  });
});

describe('Petitions clerk', () => {
  before(() => {
    cy.task<AuthenticationResult>('getUserToken', {
      email: 'petitionsclerk1@example.com',
      password: DEFAULT_ACCOUNT_PASS,
    }).then(result => {
      token = result.AuthenticationResult.IdToken;
    });
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should be able to create a case with paper service', () => {
    goToMyDocumentQC();
    goToCreateCase();
    closeScannerSetupDialogIfExists();
    fillInCreateCaseFromPaperForm();
    goToReviewCase().then(
      docketNumber => (createdPaperDocketNumber = docketNumber),
    );
    serveCaseToIrs();
  });

  it('should be able to serve the petition on the electronically-filed case', () => {
    goToCaseDetail(testData.createdDocketNumber);
    reviewAndServePetition();
  });
});

describe('Docket Clerk', () => {
  before(() => {
    cy.task<AuthenticationResult>('getUserToken', {
      email: 'docketclerk1@example.com',
      password: DEFAULT_ACCOUNT_PASS,
    }).then(result => {
      token = result.AuthenticationResult.IdToken;
    });
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should be able to create an order on the electronically-filed case and serve it', () => {
    // eslint-disable-next-line no-underscore-dangle
    const attempt = cy.state('runnable')._currentRetry;
    createOrder(testData.createdDocketNumber);
    editAndSignOrder();
    addDocketEntryForOrderAndSaveForLater(attempt);
    serveCourtIssuedDocketEntry();
  });

  it('should be able to create an order on the paper-filed case and serve it', () => {
    createOrder(createdPaperDocketNumber);
    editAndSignOrder();
    addDocketEntryForOrderAndServePaper();
  });

  it('should be able to upload a court-issued order pdf on the electronically-filed case', () => {
    goToCaseDetail(testData.createdDocketNumber);
    uploadCourtIssuedDocPdf();
  });

  // in its own step for retry purposes - sometimes the click fails
  it('should click the save uploaded PDF button', () => {
    // Fix flaky test
    // https://github.com/flexion/ef-cms/issues/10144
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(0);
    clickSaveUploadedPdfButton();
  });

  it('should add a docket entry for the uploaded PDF and serve', () => {
    addDocketEntryForUploadedPdfAndServe();
  });

  it('should be able to upload a court-issued order pdf on the paper-filed case', () => {
    goToCaseDetail(createdPaperDocketNumber);

    uploadCourtIssuedDocPdf();
  });

  // in its own step for retry purposes - sometimes the click fails
  it('should click the save uploaded PDF button', () => {
    clickSaveUploadedPdfButton();
  });

  it('should add a docket entry for the uploaded PDF and serve for paper', () => {
    addDocketEntryForUploadedPdfAndServePaper();
  });
});
