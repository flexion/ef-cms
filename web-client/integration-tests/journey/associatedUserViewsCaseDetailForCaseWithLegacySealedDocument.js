import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { getFormattedDocketEntriesForTest } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const associatedUserViewsCaseDetailForCaseWithLegacySealedDocument =
  integrationTest => {
    return it('associated user views case detail for a case with a legacy sealed document', async () => {
      const { formattedDocketEntriesOnDocketRecord } =
        await getFormattedDocketEntriesForTest(integrationTest);

      const legacySealedDocketEntry = formattedDocketEntriesOnDocketRecord.find(
        entry => entry.docketEntryId === integrationTest.docketEntryId,
      );

      expect(legacySealedDocketEntry.showLinkToDocument).toBeFalsy();

      const formattedCase = runCompute(formattedCaseDetail, {
        state: integrationTest.getState(),
      });

      expect(formattedCase.petitioners[0]).toMatchObject({
        address1: expect.anything(),
        contactId: expect.anything(),
        name: expect.anything(),
      });
      expect(
        integrationTest.getState('screenMetadata.isAssociated'),
      ).toBeTruthy();

      await expect(
        integrationTest.runSequence('openCaseDocumentDownloadUrlSequence', {
          docketEntryId: integrationTest.docketEntryId,
          docketNumber: integrationTest.docketNumber,
          isPublic: false,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time.');
    });
  };
