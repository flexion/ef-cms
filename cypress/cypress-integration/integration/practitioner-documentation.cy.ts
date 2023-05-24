/* eslint-disable jest/valid-describe-callback */
import {
  PRACTITIONER_DOCUMENT_TYPES_MAP,
  US_STATES,
} from '../../../shared/src/business/entities/EntityConstants';
import { navigateTo as navigateToDashboard } from '../support/pages/dashboard';

describe('Practitioner documentation', { scrollBehavior: 'center' }, () => {
  let documentCountBeforeAdd: number;

  describe('add new document', () => {
    it('logs in as an admissionsclerk', () => {
      navigateToDashboard('admissionsclerk');
    });

    it('views the add practitioner document page', () => {
      cy.visit('/practitioner-detail/PT1234?tab=practitioner-documentation');

      cy.get('[data-cy="practitioner-document-count"]')
        .invoke('text')
        .then(text1 => {
          documentCountBeforeAdd = parseInt(text1);
        });
    });

    it('attempts to add a new practitioner document and receives an error message when category has not been selected', () => {
      cy.get('[data-cy="add-practitioner-document"]').click();

      cy.get('input#practitioner-document-file').attachFile(
        '../fixtures/w3-dummy.pdf',
      );

      cy.get('[data-cy="submit-add-practitioner-document"]').click();

      cy.get('[data-cy="error-notification"]').contains(
        'Enter a category type',
      );
    });

    it('selects a category type and succesfully creates a practitioner document', () => {
      cy.get('#category-type').select(1);
      cy.get('[data-cy="submit-add-practitioner-document"]').click();
      cy.url().should(
        'contain',
        '/practitioner-detail/PT1234?tab=practitioner-documentation',
      );
      cy.get('[data-cy="practitioner-document-count"]')
        .invoke('text')
        .then(documentCountAfterAdd => {
          assert.equal(
            parseInt(documentCountAfterAdd),
            documentCountBeforeAdd + 1,
          );
        });
      cy.get('[data-cy="success-notification"]').contains(
        'The file has been added.',
      );
    });
  });

  describe('edit a document', () => {
    const updatedDescription: string = `Edited by cypress ${Math.random()}`;

    it('navigates to edit a document', () => {
      ///practitioner-detail/${barNumber}/edit-document/${document.practitionerDocumentFileId}
      cy.get('[data-cy="edit-practitioner-document"]').first().click();
    });

    it('should modify the document category', () => {
      cy.get('#category-type').select(
        PRACTITIONER_DOCUMENT_TYPES_MAP.CERTIFICATE_OF_GOOD_STANDING,
      );
    });

    it('should set the location where the certificate of good standing is valid', () => {
      cy.get('#location').select(US_STATES.UT);
    });

    it('should add a description', () => {
      cy.get('#documentation-notes').clear();
      cy.get('#documentation-notes').type(updatedDescription);
    });

    it('should save the edited document', () => {
      cy.get('[data-cy="update-practitioner-document"]').click();
      cy.url().should(
        'contain',
        '/practitioner-detail/PT1234?tab=practitioner-documentation',
      );
      cy.get('[data-cy="success-notification"]').contains(
        'The document has been updated.',
      );
      cy.contains(updatedDescription);
    });
  });

  describe('delete a document', () => {
    it('should delete the practitioner document', () => {
      cy.get('[data-cy="delete-practitioner-document"]').first().click();
      cy.get('button#confirm').click();
      cy.get('[data-cy="practitioner-document-count"]')
        .invoke('text')
        .then(documentCountAfterDelete => {
          assert.equal(
            parseInt(documentCountAfterDelete),
            documentCountBeforeAdd,
          );
        });
    });
  });
});
