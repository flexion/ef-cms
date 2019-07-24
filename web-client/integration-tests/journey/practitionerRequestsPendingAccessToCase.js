export default (test, fakeFile) => {
  return it('Practitioner requests access to case', async () => {
    await test.runSequence('gotoRequestAccessSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('reviewRequestAccessInformationSequence');

    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'certificateOfService',
      'documentTitleTemplate',
      'documentType',
      'eventCode',
      'primaryDocumentFile',
      'representingPrimary',
      'scenario',
    ]);

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'documentType',
      value: 'Motion to Substitute Parties and Change Caption',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'documentTitleTemplate',
      value: 'Motion to Substitute Parties and Change Caption',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'eventCode',
      value: 'M107',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'scenario',
      value: 'Standard',
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'attachments',
      'certificateOfService',
      'exhibits',
      'hasSupportingDocuments',
      'objections',
      'primaryDocumentFile',
      'representingPrimary',
    ]);

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfService',
      value: false,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'objections',
      value: 'No',
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'exhibits',
      value: false,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'attachments',
      value: false,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'hasSupportingDocuments',
      value: true,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'representingSecondary',
      value: true,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'supportingDocument',
    ]);

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'supportingDocument',
      value: 'Declaration in Support',
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'supportingDocumentMetadata.documentType',
      value: 'Declaration in Support',
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'supportingDocumentMetadata.category',
      value: 'Supporting Document',
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'supportingDocumentFile',
      'supportingDocumentFreeText',
    ]);

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'supportingDocumentFreeText',
      value: 'No',
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'supportingDocumentMetadata.freeText',
      value: 'No',
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'supportingDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('reviewRequestAccessInformationSequence');

    expect(test.getState('form.documentTitle')).toEqual(
      'Motion to Substitute Parties and Change Caption',
    );
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitCaseAssociationRequestSequence');
  });
};
