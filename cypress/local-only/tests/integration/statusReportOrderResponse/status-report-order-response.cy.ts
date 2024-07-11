import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';
import {
  loginAsAdc,
  loginAsColvin,
  loginAsColvinChambers,
  loginAsDocketClerk1,
} from '../../../../helpers/authentication/login-as-helpers';
import { logout } from '../../../../helpers/authentication/logout';

// TODO 10102-story: cleanup test and reduce redundancy (not necessarily creating helpers but before each and consts)

const docketNumber = '107-19';
const leadCaseDocketNumber = '102-67';
const docketEntryId = '178af2d2-fab1-445a-a729-d3da63517a0a';
const messages = {
  statusReport: {
    messageId: '73d4365b-8b3a-4b01-9ca3-7087f7a6d4b5',
    name: 'Status Report',
  },
  testOrderResponseSigned: {
    messageId: '32484c7f-4606-49fc-89f1-27ba1d5596be',
    name: 'Test Order Response (Signed)',
  },
  testOrderResponseUnsigned: {
    messageId: '34483b5b-29de-4ad4-8caa-59f71ad6d906',
    name: 'Test Order Response (Unsigned)',
  },
};
const today = formatNow(FORMATS.MMDDYYYY);
const formattedToday = formatNow(FORMATS.MONTH_DAY_YEAR);
const expectedPdfLines = [
  'On June 28, 2024, a status report was filed in this case (Index no. 5). For cause, it is',
  `ORDERED that the parties shall file a further status report by ${formattedToday}. It is further`,
  'ORDERED that this case is stricken from the trial session. It is further',
  'ORDERED that jurisdiction is retained by the undersigned. It is further',
  'ORDERED that Here is my additional order text.',
];

const getFakeTestOrderName = () => {
  // Use a timestamp for easier local testing (no need to refresh api between tests)
  const timestamp = formatNow(FORMATS.LOG_TIMESTAMP);
  return `Test Order ${timestamp}`;
};

const navigateToStatusReportOrderResponseForm = (docketNum: string) => {
  cy.visit(`/case-detail/${docketNum}`);
  cy.get('#tab-document-view').click();
  cy.contains('Status Report').click();
  cy.get('[data-testid="order-response-button"]').click();
};

const createBlankTestOrder = (
  whichDocketNumber: string,
  orderName: string,
  sign: boolean,
) => {
  navigateToStatusReportOrderResponseForm(whichDocketNumber);
  cy.get('#docket-entry-description').clear();
  cy.get('#docket-entry-description').type(orderName);
  finishOrderDraft(sign);
};

const selectAllOptionsInForm = (orderName: string = 'Important Order') => {
  // Assumes you are looking at the form
  cy.get('#order-type-status-report').check({ force: true });
  cy.get('#status-report-due-date-picker').type(today);
  cy.get('#stricken-from-trial-sessions').check({ force: true });
  cy.get('#jurisdiction-retained').check({ force: true });
  cy.get('#additional-order-text').type('Here is my additional order text.');
  cy.get('#docket-entry-description').clear();
  cy.get('#docket-entry-description').type(orderName);
};

const createOrderFromMessage = (sign: boolean) => {
  // This assumes you are looking at the relevant docket number
  cy.get('#tab-case-messages').click();
  cy.contains('a', 'Status Report').click();
  cy.get('[data-testid="order-response-button"]').click();
  finishOrderDraft(sign);
};

const editOrderFromMessage = (
  orderName: string,
  isSigned: boolean,
  sign: boolean,
) => {
  // This assumes you are looking at the relevant docket number
  cy.get('#tab-case-messages').click();
  cy.contains('a', orderName).click();
  cy.get('[data-testid="edit-document-button"]').click();
  // Click confirm modal if it exists
  if (isSigned) {
    cy.get('[data-testid="modal-button-confirm"]').click();
  }
  finishOrderDraft(sign);
};

const finishOrderDraft = (sign: boolean) => {
  // This assumes you are in the Status Report Order Response Form
  cy.get('[data-testid="save-draft-button"]').click();
  cy.contains('Apply Signature').should('exist');
  if (sign) {
    cy.get('[data-testid="sign-pdf-canvas"]').click();
    cy.get('[data-testid="save-signature-button"]').click();
  } else {
    cy.get('[data-testid="skip-signature-button"]').click();
  }
};

describe('Status Report Order Response', () => {
  describe('judge', () => {
    beforeEach(() => {
      loginAsColvin();
    });

    describe('pdf preview', () => {
      it('should show a pdf preview when clicking preview pdf', () => {
        navigateToStatusReportOrderResponseForm(docketNumber);

        cy.get('[data-testid="preview-pdf-button"]').click();

        cy.get(
          '[data-testid="status-report-order-response-pdf-preview"]',
        ).should('be.empty');
      });
    });

    describe('form validation', () => {
      it('should have a docket entry description', () => {
        navigateToStatusReportOrderResponseForm(docketNumber);

        cy.get('#docket-entry-description').clear();
        cy.get('[data-testid="save-draft-button"]').click();

        cy.get('[data-testid="error-alert"]').should(
          'contain.text',
          'Enter a docket entry description',
        );
        cy.get('#docket-entry-description-form-group').should(
          'contain.text',
          'Enter a docket entry description',
        );
      });

      it('should have a valid due date', () => {
        navigateToStatusReportOrderResponseForm(docketNumber);

        cy.get('#order-type-status-report').check({ force: true });
        cy.get('#status-report-due-date-picker').type('bb-bb-bbbb');
        cy.get('[data-testid="save-draft-button"]').click();

        cy.get('[data-testid="error-alert"]').should(
          'contain.text',
          'Enter a valid date',
        );
        cy.get('#status-report-due-date-form-group').should(
          'contain.text',
          'Enter a valid date',
        );
      });

      it('should have a due date prior to today', () => {
        navigateToStatusReportOrderResponseForm(docketNumber);

        cy.get('#order-type-status-report').check({ force: true });

        cy.get('#status-report-due-date-picker').type('07/04/2023');
        cy.get('[data-testid="save-draft-button"]').click();

        cy.get('[data-testid="error-alert"]').should(
          'contain.text',
          'Due date cannot be prior to today. Enter a valid date.',
        );
        cy.get('#status-report-due-date-form-group').should(
          'contain.text',
          'Due date cannot be prior to today. Enter a valid date.',
        );
      });

      it('should have a jurisdiction when case is stricken from trial session', () => {
        navigateToStatusReportOrderResponseForm(docketNumber);

        cy.get('#stricken-from-trial-sessions').check({ force: true });
        cy.get('[data-testid="save-draft-button"]').click();

        cy.get('[data-testid="error-alert"]').should(
          'contain.text',
          'Jurisdiction is required since case is stricken from the trial session',
        );
        cy.get('#jurisdiction-form-group').should(
          'contain.text',
          'Select jurisdiction',
        );
      });
    });

    describe('filing a status report order response from document view', () => {
      it('should save draft when no options are selected', () => {
        navigateToStatusReportOrderResponseForm(docketNumber);

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

        // save as draft
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expect(req.body.contentHtml).to.include(expectedPdfLines[0]);
          expectedPdfLines.forEach((pdfLine, i) => {
            if (i > 0) {
              expect(req.body.contentHtml).to.not.include(pdfLine);
            }
          });
        });

        cy.contains('Apply Signature').should('exist');
      });

      it('should save draft when all options are selected', () => {
        navigateToStatusReportOrderResponseForm(docketNumber);

        // selecting our options
        selectAllOptionsInForm();

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

        // save as draft
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expectedPdfLines.forEach(pdfLine => {
            expect(req.body.contentHtml).to.include(pdfLine);
          });
        });

        cy.contains('Apply Signature').should('exist');
      });

      it('should save draft when order type is "Status Report or Stipulated Decision"', () => {
        const secondPdfLine = `ORDERED that the parties shall file a status report or proposed stipulated decision by ${formattedToday}`;

        navigateToStatusReportOrderResponseForm(docketNumber);

        // selecting our options
        cy.get('#order-type-or-stipulated-decision').check({ force: true });
        cy.get('#status-report-due-date-picker').type(today);

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

        // save as draft
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expect(req.body.contentHtml).to.include(expectedPdfLines[0]);
          expect(req.body.contentHtml).to.include(secondPdfLine);
          expect(req.body.contentHtml).to.not.include(expectedPdfLines[1]);
        });

        cy.contains('Apply Signature').should('exist');
      });

      it('should save draft when jurisdiction is "Restored to the general docket"', () => {
        const secondPdfLine =
          'ORDERED that this case is restored to the general docket.';

        navigateToStatusReportOrderResponseForm(docketNumber);

        // selecting our options
        cy.get('#jurisdiction-restored-to-general-docket').check({
          force: true,
        });

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

        // save as draft
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expect(req.body.contentHtml).to.include(expectedPdfLines[0]);
          expect(req.body.contentHtml).to.include(secondPdfLine);
          expect(req.body.contentHtml).to.not.include(expectedPdfLines[3]);
        });

        cy.contains('Apply Signature').should('exist');
      });

      it('should save draft with all case docket numbers on PDF when issue order is "All cases in this group"', () => {
        navigateToStatusReportOrderResponseForm(leadCaseDocketNumber);

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

        // save as draft
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expect(req.body.addedDocketNumbers).to.include.members([
            '102-67',
            '103-67',
            '104-67',
            '105-67',
          ]);
        });

        cy.contains('Apply Signature').should('exist');
      });

      it('should save draft with just lead case docket number on PDF when issue order is "Just this case"', () => {
        navigateToStatusReportOrderResponseForm(leadCaseDocketNumber);

        cy.get('#just-this-case').click({ force: true });

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

        // save as draft
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expect(req.body.addedDocketNumbers).to.be.empty;
        });

        cy.contains('Apply Signature').should('exist');
      });
    });

    describe('filing a status report order response from message view', () => {
      describe('with signature', () => {
        it('should be able to create order response from messages', () => {
          cy.visit(`/case-detail/${docketNumber}`);
          // Go to a sent message and create an Order Response
          createOrderFromMessage(true);

          // Check we have been redirected to the messages page
          cy.contains('Order updated.').should('exist');
          cy.url().should(
            'include',
            `messages/${docketNumber}/message-detail/`,
          );
        });

        // TODO: This test is failing: trying to edit the signed pdf does not work.
        // It seems like it might need the file in the seeded data.
        it.skip('should be able to edit order response from messages', () => {
          cy.visit(`/case-detail/${docketNumber}`);

          // Go to the sent message and edit the Order Response
          editOrderFromMessage(
            messages.testOrderResponseSigned.name,
            true,
            true,
          );

          // Check we have been redirected to the messages page
          cy.contains(
            `${messages.testOrderResponseSigned.name} updated.`,
          ).should('exist');
          cy.url().should(
            'include',
            `messages/${docketNumber}/message-detail/`,
          );
        });
      });

      describe('without signature', () => {
        it('should be able to create order response from messages', () => {
          cy.visit(`/case-detail/${docketNumber}`);
          // Go to the sent message and create an Order Response
          createOrderFromMessage(false);

          // Check we have been redirected to the messages page
          cy.contains('Order updated.').should('exist');
          cy.url().should(
            'include',
            `messages/${docketNumber}/message-detail/`,
          );
        });

        it('should be able to edit order response from messages', () => {
          cy.visit(`/case-detail/${docketNumber}`);
          // Go to the sent message and edit the Order Response
          editOrderFromMessage(
            messages.testOrderResponseUnsigned.name,
            false,
            false,
          );

          // Check we have been redirected to the messages page
          cy.contains(
            `${messages.testOrderResponseUnsigned.name} updated.`,
          ).should('exist');
          cy.url().should(
            'include',
            `messages/${docketNumber}/message-detail/`,
          );
        });
      });
    });

    describe('save status report order response to drafts', () => {
      it('with signature', () => {
        const testOrderName = getFakeTestOrderName();
        createBlankTestOrder(docketNumber, testOrderName, true);
        cy.get('#tab-drafts').click();
        cy.contains('button', testOrderName).should('exist');
      });

      it('without signature', () => {
        const testOrderName = getFakeTestOrderName();
        createBlankTestOrder(docketNumber, testOrderName, false);
        cy.get('#tab-drafts').click();
        cy.contains('button', testOrderName).should('exist');
      });
    });

    describe('edit an existing status report order response', () => {
      let testOrderName = '';
      beforeEach(() => {
        testOrderName = getFakeTestOrderName();
        createBlankTestOrder(docketNumber, testOrderName, false);
      });

      it('should save modifications made to an existing status report order response', () => {
        // We create a revised order name to ensure it replaces the old order name.
        // We reverse the string rather than, e.g., testOrderName + Revised make it easier to find one and not the other
        const revisedOrderName = testOrderName.split('').reverse().join('');
        cy.get('#tab-drafts').click();
        cy.contains('button', testOrderName).click();
        cy.get('[data-testid="draft-edit-button-not-signed"]').click();
        selectAllOptionsInForm(revisedOrderName);

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expectedPdfLines.forEach(pdfLine => {
            expect(req.body.contentHtml).to.include(pdfLine);
          });
        });

        finishOrderDraft(false);
        cy.get('#tab-drafts').click();
        cy.contains('button', revisedOrderName).should('exist');
        cy.contains('button', testOrderName).should('not.exist'); // Make sure old order name no longer exists
      });
    });
  });

  describe('docket clerk', () => {
    it('should serve status report order response', () => {
      // Create a Status Report Order Response as a judge
      loginAsColvin();
      const orderName = getFakeTestOrderName();
      createBlankTestOrder(docketNumber, orderName, true);
      logout();

      // Go to the Status Report Order Response and serve it as a docket clerk
      loginAsDocketClerk1();
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('#tab-drafts').click();
      cy.contains('button', orderName).click();
      cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
      cy.get('[data-testid="service-stamp-Served"]').click({ force: true });
      cy.get('[data-testid="serve-to-parties-btn"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.contains('Document served.').should('exist');
      cy.contains('button', orderName).should('exist');
    });

    it('should not be able to edit using status report order response form', () => {
      loginAsDocketClerk1();
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('#tab-document-view').click();
      cy.contains('Status Report').click();
      // Make sure Order Response button is not available
      cy.get('[data-testid="order-response-button"]').should('not.exist');
    });

    it('should not be able to view status report order response route', () => {
      loginAsDocketClerk1();
      [
        `/case-detail/${docketNumber}/documents/${docketEntryId}/order-response-create?statusReportFilingDate=2024-06-28&statusReportIndex=1`,
        `/case-detail/${docketNumber}/documents/${docketEntryId}/order-response-edit`,
        `/messages/${docketNumber}/message-detail/${messages.statusReport.messageId}/${docketEntryId}/order-response-create?statusReportFilingDate=2024-06-28&statusReportIndex=1`,
        `/messages/${docketNumber}/message-detail/${messages.statusReport.messageId}/${docketEntryId}/order-response-create`,
      ].forEach((route: string) => {
        cy.visit(route);
        cy.contains('Error 404').should('exist');
      });
    });
  });

  describe('chambers', () => {
    describe('filing a status report order response from document view', () => {
      it('should save draft when all options are selected', () => {
        loginAsColvinChambers();
        navigateToStatusReportOrderResponseForm(docketNumber);

        // selecting our options
        selectAllOptionsInForm();

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

        // save as draft
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expectedPdfLines.forEach(pdfLine => {
            expect(req.body.contentHtml).to.include(pdfLine);
          });
        });

        cy.contains('Apply Signature').should('exist');
      });
    });
  });

  describe('adc', () => {
    describe('filing a status report order response from document view', () => {
      it('should save draft when all options are selected', () => {
        loginAsAdc();
        navigateToStatusReportOrderResponseForm(docketNumber);

        // selecting our options
        selectAllOptionsInForm();

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

        // save as draft
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expectedPdfLines.forEach(pdfLine => {
            expect(req.body.contentHtml).to.include(pdfLine);
          });
        });

        cy.contains('Apply Signature').should('exist');
      });
    });
  });
});
