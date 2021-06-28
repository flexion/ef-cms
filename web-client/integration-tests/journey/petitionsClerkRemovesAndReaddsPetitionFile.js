import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkRemovesAndReaddsPetitionFile = (
  integrationTest,
  fakeFile,
) => {
  const formattedWorkQueue = withAppContextDecorator(
    formattedWorkQueueComputed,
  );

  const documentToRemoveAndReAdd = 'petitionFile';
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();

  return it('Petitions Clerk removes and readds petition file', async () => {
    integrationTest.setState(
      'currentViewMetadata.documentSelectedForPreview',
      documentToRemoveAndReAdd,
    );
    await integrationTest.runSequence('setDocumentForPreviewSequence');

    const docketEntryIdToReplace = integrationTest.getState('docketEntryId');
    const previousPetitionDocument = integrationTest
      .getState('caseDetail.docketEntries')
      .find(entry => entry.docketEntryId === docketEntryIdToReplace);
    const previousDocketRecordEntry = integrationTest
      .getState('caseDetail.docketEntries')
      .find(entry => entry.docketEntryId === docketEntryIdToReplace);
    const previousPetitionFormattedWorkItem = runCompute(formattedWorkQueue, {
      state: integrationTest.getState(),
    }).find(item => item.docketEntry.docketEntryId === docketEntryIdToReplace);

    expect(docketEntryIdToReplace).toBeDefined();
    expect(integrationTest.getState('pdfPreviewUrl')).toBeDefined();

    await integrationTest.runSequence('deleteUploadedPdfSequence');

    const deletedDocument = integrationTest
      .getState('form.docketEntries')
      .find(doc => doc.docketEntryId === docketEntryIdToReplace);
    expect(deletedDocument).toBeUndefined();
    expect(integrationTest.getState('pdfPreviewUrl')).toBeUndefined();

    await integrationTest.runSequence('saveSavedCaseForLaterSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      petitionFile: 'Upload or scan a Petition',
    });

    await integrationTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'petitionFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(
      integrationTest.getState('form')[documentToRemoveAndReAdd],
    ).toBeDefined();

    await integrationTest.runSequence('saveSavedCaseForLaterSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({});

    const updatedPetitionDocument = integrationTest
      .getState('caseDetail.docketEntries')
      .find(doc => doc.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode);
    const updatedDocketRecordEntry = integrationTest
      .getState('caseDetail.docketEntries')
      .find(entry => entry.docketEntryId === docketEntryIdToReplace);
    const updatedPetitionFormattedWorkItem = runCompute(formattedWorkQueue, {
      state: integrationTest.getState(),
    }).find(item => item.docketEntry.docketEntryId === docketEntryIdToReplace);

    expect(previousPetitionDocument).toEqual(updatedPetitionDocument);
    expect(previousDocketRecordEntry).toEqual(updatedDocketRecordEntry);
    expect(previousPetitionFormattedWorkItem).toEqual(
      updatedPetitionFormattedWorkItem,
    );
  });
};
