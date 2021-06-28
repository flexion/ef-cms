export const docketClerkNavigatesToEditDocketEntryCertificateOfService = (
  integrationTest,
  docketRecordIndex = 2,
) => {
  it('the docketclerk navigates to page to edit docket entry meta for a minute entry', async () => {
    await integrationTest.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: integrationTest.docketNumber,
      docketRecordIndex,
    });

    expect(integrationTest.getState('form.numberOfPages')).toEqual(2);

    expect(integrationTest.getState('currentPage')).toEqual(
      'EditDocketEntryMeta',
    );
    expect(
      integrationTest.getState('screenMetadata.documentTitlePreview'),
    ).toEqual('Certificate of Service of Petition 03-03-2003');
    expect(integrationTest.getState('form.serviceDate')).toEqual(
      '2003-03-03T05:00:00.000Z',
    );

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'serviceDateMonth',
        value: '05',
      },
    );
    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'serviceDateDay',
        value: '10',
      },
    );
    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'serviceDateYear',
        value: '2005',
      },
    );

    expect(
      integrationTest.getState('screenMetadata.documentTitlePreview'),
    ).toEqual('Certificate of Service of Petition 05-10-2005');
    expect(integrationTest.getState('form.serviceDate')).toEqual(
      '2005-05-10T04:00:00.000Z',
    );

    await integrationTest.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('alertSuccess')).toMatchObject({
      message: 'Docket entry changes saved.',
    });

    await integrationTest.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: integrationTest.docketNumber,
      docketRecordIndex,
    });

    expect(integrationTest.getState('form.numberOfPages')).toEqual(3);

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDateDay',
        value: '13',
      },
    );
    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDateMonth',
        value: '07',
      },
    );
    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDateYear',
        value: '2002',
      },
    );

    await integrationTest.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('alertSuccess')).toMatchObject({
      message: 'Docket entry changes saved.',
    });

    await integrationTest.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: integrationTest.docketNumber,
      docketRecordIndex,
    });

    expect(integrationTest.getState('form.numberOfPages')).toEqual(4);

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'eventCode',
        value: 'BND',
      },
    );

    await integrationTest.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('alertSuccess')).toMatchObject({
      message: 'Docket entry changes saved.',
    });

    await integrationTest.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: integrationTest.docketNumber,
      docketRecordIndex,
    });

    expect(integrationTest.getState('form.numberOfPages')).toEqual(5);
  });
};
