import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument =
  integrationTest => {
    return it('unassociated user views case detail for a case with a legacy sealed document', async () => {
      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: integrationTest.docketNumber,
      });

      const formattedCase = runCompute(formattedCaseDetail, {
        state: integrationTest.getState(),
      });

      expect(formattedCase.docketEntries).toEqual([]);

      await expect(
        integrationTest.runSequence('openCaseDocumentDownloadUrlSequence', {
          docketEntryId: integrationTest.docketEntryId,
          docketNumber: integrationTest.docketNumber,
          isPublic: false,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time.');
    });
  };
