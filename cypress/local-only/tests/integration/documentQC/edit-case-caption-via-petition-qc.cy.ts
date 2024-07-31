import {
  getCaseInfoTab,
  getCaseTitleContaining,
  getCaseTitleTextArea,
  getHasIrsNoticeYesRadioButton,
  getIrsNoticeTab,
  getReviewPetitionButton,
  getSaveForLaterButton,
} from '../../../support/pages/petition-qc';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('change the case caption via the petition qc page', () => {
  it('updates the case title header', () => {
    loginAsPetitionsClerk();
    cy.visit('/case-detail/102-20/petition-qc');
    getCaseInfoTab().click();
    getCaseTitleTextArea().clear().type('hello world');
    getIrsNoticeTab().click();
    getHasIrsNoticeYesRadioButton().click();
    getReviewPetitionButton().click();
    getSaveForLaterButton().click();
    loginAsPetitionsClerk();
    cy.visit('/case-detail/102-20');
    getCaseTitleContaining(
      'hello world v. Commissioner of Internal Revenue, Respondent',
    ).should('exist');
  });
});
