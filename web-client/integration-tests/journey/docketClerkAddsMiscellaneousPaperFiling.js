import { contactPrimaryFromState } from '../helpers';

export const docketClerkAddsMiscellaneousPaperFiling = (
  integrationTest,
  fakeFile,
) => {
  return it('DocketClerk adds miscellaneous paper filing', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 4,
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 30,
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2001,
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
      value: 'MISC',
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'A title',
    });

    await integrationTest.runSequence('submitPaperFilingSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
    );

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    expect(integrationTest.getState('form')).toEqual({});

    const miscellaneousDocument = integrationTest
      .getState('caseDetail.docketEntries')
      .find(doc => doc.eventCode === 'MISC');

    expect(miscellaneousDocument.documentTitle).not.toContain('Miscellaneous');
    expect(miscellaneousDocument.documentTitle).toEqual('A title');
  });
};
