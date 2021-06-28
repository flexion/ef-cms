export const docketClerkEditsDocketEntryMetaMinuteEntry = integrationTest => {
  return it('docket clerk edits docket entry meta for a minute entry', async () => {
    expect(integrationTest.getState('currentPage')).toEqual(
      'EditDocketEntryMeta',
    );

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDate',
        value: '2020-01-04',
      },
    );

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDateDay',
        value: '04',
      },
    );

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDateMonth',
        value: '01',
      },
    );

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDateYear',
        value: '2020',
      },
    );

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'documentTitle',
        value: 'Request for Place of Trial at Boise, Idaho',
      },
    );

    await integrationTest.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('alertSuccess')).toMatchObject({
      message: 'Docket entry changes saved.',
    });
  });
};
