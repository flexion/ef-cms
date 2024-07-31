import { getCaseDetailTab } from '../../../../support/pages/case-detail';
import { loginAsIrsPractitioner } from '../../../../../helpers/authentication/login-as-helpers';

describe('IRS Practitioner views case detail', () => {
  it('should NOT display filing fee information', () => {
    loginAsIrsPractitioner('irsPractitioner@example.com');
    cy.visit('/case-detail/101-19');
    getCaseDetailTab('case-information').click();
    cy.get('[data-testid="filling-fee-message"]').should('not.exist');
  });
});
