import { contactPrimaryFromState } from '../helpers';

export const docketClerkVerifiesPractitionerStillExistsOnCase =
  integrationTest => {
    return it('docket clerk verifies practitioner is still on case', async () => {
      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: integrationTest.docketNumber,
      });

      const caseDetail = integrationTest.getState('caseDetail');

      // checking that removing the represented petitioner did not disassociate the counsel from other petitioners
      expect(caseDetail.privatePractitioners[0].representing).toEqual([
        contactPrimaryFromState(integrationTest).contactId,
      ]);
      expect(caseDetail.privatePractitioners[0].representing).not.toContain(
        integrationTest.intervenorContactId,
      );
    });
  };
