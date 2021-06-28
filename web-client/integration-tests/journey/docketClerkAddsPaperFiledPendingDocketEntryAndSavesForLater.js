import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import {
  contactPrimaryFromState,
  getFormattedDocketEntriesForTest,
} from '../helpers';

export const docketClerkAddsPaperFiledPendingDocketEntryAndSavesForLater = (
  integrationTest,
  fakeFile,
) => {
  const { DOCUMENT_RELATIONSHIPS } = applicationContext.getConstants();

  return it('Docketclerk adds paper filed docket entry and saves for later', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('updateScreenMetadataSequence', {
      key: DOCUMENT_RELATIONSHIPS.SUPPORTING,
      value: false,
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 1,
    });
    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 1,
    });
    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
    });
    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });
    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFileSize',
      value: 100,
    });
    const contactPrimary = contactPrimaryFromState(integrationTest);

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );
    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'A',
    });
    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'pending',
      value: true,
    });

    await integrationTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    integrationTest.docketEntryId = integrationTest
      .getState('caseDetail.docketEntries')
      .find(doc => doc.eventCode === 'A').docketEntryId;

    expect(integrationTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
    );

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    expect(integrationTest.getState('form')).toEqual({});

    const { formattedPendingDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);

    expect(formattedPendingDocketEntriesOnDocketRecord).toEqual([]);
  });
};
