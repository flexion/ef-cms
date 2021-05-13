import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const associatedUserViewsCaseDetailForCaseWithLegacySealedDocument = test => {
  return it('associated user views case detail for a case with a legacy sealed document', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const formattedCase = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });
    const legacySealedDocketEntry = formattedCase.formattedDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === test.docketEntryId,
    );

    expect(legacySealedDocketEntry.showLinkToDocument).toBeFalsy();
    expect(formattedCase.contactPrimary).toMatchObject({
      address1: expect.anything(),
      contactId: expect.anything(),
      name: expect.anything(),
    });
    expect(test.getState('screenMetadata.isAssociated')).toBeTruthy();

    await expect(
      test.runSequence('openCaseDocumentDownloadUrlSequence', {
        docketEntryId: test.docketEntryId,
        docketNumber: test.docketNumber,
        isPublic: false,
      }),
    ).rejects.toThrow('Unauthorized to view document at this time.');
  });
};
