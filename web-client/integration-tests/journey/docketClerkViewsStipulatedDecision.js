import { getFormattedDocumentQCSectionInbox } from '../helpers';

export const docketClerkViewsStipulatedDecision = integrationTest => {
  describe('a docket clerk views Section Document QC and selects a Stipulated Decision', () => {
    it('views Section Document QC box', async () => {
      const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
        integrationTest,
      );
      const stipDecision = documentQCSectionInbox.find(
        item =>
          item.docketEntry.documentType === 'Proposed Stipulated Decision',
      );
      integrationTest.stipDecision = stipDecision;
      expect(stipDecision).not.toBeNull();
    });
  });
};
