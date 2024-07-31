import { loginAsPrivatePractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Private practitioner mobile', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
  });

  it('should have access to case, order, and opinion advanced searches (and NOT practitioner advanced search)', () => {
    loginAsPrivatePractitioner('privatePractitioner@example.com');

    cy.get('[data-testid="advanced-search-link"]').click();

    cy.get('[data-testid="advanced-search-type-mobile-selector"]')
      .children()
      .then(options => {
        const actualAdvancedSearchOptions: string[] = [...options].map(
          o => o.innerText,
        );

        const expectedAdvancedSearchOptions = ['Case', 'Order', 'Opinion'];
        expect(actualAdvancedSearchOptions).to.deep.eq(
          expectedAdvancedSearchOptions,
        );
      });
  });
});
