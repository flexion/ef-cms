import { getFakeBlob } from '../../../shared/src/business/test/getFakeFile';
import { waitForExpectedItem } from '../helpers';

export const docketClerkEditsSignedUploadedCourtIssuedDocument =
  cerebralTest => {
    return it('Docket Clerk edits a signed uploaded court issued document', async () => {
      await cerebralTest.runSequence('openConfirmEditModalSequence', {
        docketEntryIdToEdit: cerebralTest.docketEntryId,
        docketNumber: cerebralTest.docketNumber,
      });

      await cerebralTest.runSequence('navigateToEditOrderSequence');

      await waitForExpectedItem({
        cerebralTest,
        currentItem: 'currentPage',
        expectedItem: 'EditUploadCourtIssuedDocument',
      });

      await cerebralTest.runSequence('clearExistingDocumentSequence');

      await cerebralTest.runSequence('validateFileInputSequence', {
        file: getFakeBlob(),
        theNameOfTheFileOnTheEntity: 'primaryDocumentFile',
      });

      await cerebralTest.runSequence('editUploadCourtIssuedDocumentSequence', {
        tab: 'drafts',
      });

      expect(cerebralTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );

      const caseDocument = cerebralTest
        .getState('caseDetail.docketEntries')
        .find(d => d.docketEntryId === cerebralTest.docketEntryId);
      expect(caseDocument.signedAt).toEqual(null);
    });
  };
