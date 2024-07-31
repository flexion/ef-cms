import { fillInAndSubmitForm } from '../../../support/pages/start-a-case';
import {
  getCaseList,
  getStartCaseButton,
} from '../../../support/pages/dashboard-practitioner';
import { loginAsPrivatePractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Start a case as a practitioner', () => {
  it('go to the practitioner dashboard, file a case, and expect case count to increment by one', () => {
    loginAsPrivatePractitioner('privatePractitioner@example.com');

    getCaseList().then(cases => {
      getStartCaseButton().click();
      fillInAndSubmitForm();
      getCaseList().should('exist');
      getCaseList().should('have.length', cases.length + 1);
    });
  });
});
