import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

const { STATUS_TYPES } = applicationContext.getConstants();

export const docketClerkCreatesDocketEntryForSignedStipulatedDecision =
  integrationTest => {
    return it('docketclerk creates a docket entry for the signed stipulated decision', async () => {
      await integrationTest.runSequence(
        'gotoAddCourtIssuedDocketEntrySequence',
        {
          docketEntryId: integrationTest.stipDecisionDocketEntryId,
          docketNumber: integrationTest.docketNumber,
        },
      );

      expect(integrationTest.getState('form.documentType')).toEqual(
        'Stipulated Decision',
      );

      await integrationTest.runSequence(
        'updateCourtIssuedDocketEntryFormValueSequence',
        {
          key: 'judge',
          value: 'Judge Ashford',
        },
      );

      await integrationTest.runSequence(
        'openConfirmInitiateServiceModalSequence',
      );
      expect(integrationTest.getState('validationErrors')).toEqual({});

      await integrationTest.runSequence(
        'serveCourtIssuedDocumentFromDocketEntrySequence',
      );
      expect(integrationTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );
      const documents = integrationTest
        .getState('caseDetail.docketEntries')
        .filter(d => d.isOnDocketRecord);
      expect(documents.length).toEqual(4);
      const stipDecisionDocument = integrationTest
        .getState('caseDetail.docketEntries')
        .find(d => d.documentType === 'Stipulated Decision');
      expect(stipDecisionDocument.servedAt).toBeDefined();
      expect(integrationTest.getState('caseDetail.status')).toEqual(
        STATUS_TYPES.closed,
      );
    });
  };
