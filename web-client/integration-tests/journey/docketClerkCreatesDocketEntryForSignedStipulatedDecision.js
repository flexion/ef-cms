import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

const { STATUS_TYPES } = applicationContext.getConstants();

export const docketClerkCreatesDocketEntryForSignedStipulatedDecision = test => {
  return it('docketclerk creates a docket entry for the signed stipulated decision', async () => {
    await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketNumber: test.docketNumber,
      documentId: test.stipDecisionDocumentId,
    });

    expect(test.getState('form.documentType')).toEqual('Stipulated Decision');

    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'judge',
      value: 'Judge Ashford',
    });

    await test.runSequence('openConfirmInitiateServiceModalSequence');
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('serveCourtIssuedDocumentFromDocketEntrySequence');
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    const documents = test
      .getState('caseDetail.documents')
      .filter(d => d.isOnDocketRecord);
    // expect(documents.length).toEqual(3);
    // TODO 636 -- lowered count because we didn't put Petition.isOnDocketRecord = true
    expect(documents.length).toEqual(2);
    const stipDecisionDocument = test
      .getState('caseDetail.documents')
      .find(d => d.documentType === 'Stipulated Decision');
    expect(stipDecisionDocument.servedAt).toBeDefined();
    expect(test.getState('caseDetail.status')).toEqual(STATUS_TYPES.closed);
  });
};
