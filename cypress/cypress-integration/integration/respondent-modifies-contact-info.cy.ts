import { petitionerCreatesACase } from '../../helpers/petitioner-creates-a-case';
import { petitionsclerkAddsRespondentToCase } from '../../helpers/petitionsclerk-adds-respondent-to-case';
import { petitionsclerkServePetition } from '../../helpers/petitionsclerk-serves-petition';
import { respondentModifiesContactInfo } from '../../helpers/respondent-modifies-contact-info';

const BAR_NUMBER = 'WN7777';
const USER = 'irspractitioner2';

describe('a repondent modifies their address', () => {
  it('should generate a notice of change address for all cases associated with the respondent', function () {
    petitionerCreatesACase().then(docketNumber => {
      petitionsclerkServePetition(docketNumber);
      petitionsclerkAddsRespondentToCase(docketNumber, BAR_NUMBER);
      respondentModifiesContactInfo(USER).then(newAddress => {
        cy.login(USER, `case-detail/${docketNumber}`);
        cy.get('[data-testid="document-download-link-NCA"]').should('exist');
        cy.get('[data-testid="tab-case-information"]').click();
        cy.get('[data-testid="tab-partie"]s').click();
        cy.get('[data-testid="respondent-counsel"]').click();
        cy.get('[data-testid="address1-line"]')
          .contains(`${newAddress}`)
          .should('exist');
      });
    });
  });

  it('should not generate a notice of change address for any cases with unserved petitions', function () {
    petitionerCreatesACase().then(docketNumber => {
      petitionsclerkAddsRespondentToCase(docketNumber, BAR_NUMBER);
      respondentModifiesContactInfo(USER);
      cy.login(USER, `case-detail/${docketNumber}`);
      cy.get('[data-testid="document-download-link-NCA"]').should('not.exist');
    });
  });
});
