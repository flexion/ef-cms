export default (test, fakeFile) => {
  return it('Taxpayer files document for case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoFileDocumentSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('selectDocumentSequence');

    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'category',
      'documentType',
    ]);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'category',
      value: 'Answer (filed by respondent only)',
    });

    await test.runSequence('validateSelectDocumentTypeSequence');
    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'documentType',
    ]);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'documentType',
      value: 'Answer',
    });

    await test.runSequence('validateSelectDocumentTypeSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('form.documentType')).toEqual('Answer');

    await test.runSequence('editSelectedDocumentSequence');

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'category',
      value: 'Motion',
    });

    await test.runSequence('clearWizardDataSequence', {
      key: 'category',
    });

    await test.runSequence('selectDocumentSequence');

    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'documentType',
    ]);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'documentType',
      value: 'Motion for Leave to File Out of Time',
    });

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('selectDocumentSequence');

    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'secondaryDocument',
    ]);
    expect(
      Object.keys(test.getState('validationErrors.secondaryDocument')).sort(),
    ).toEqual(['category', 'documentType']);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondaryDocument.category',
      value: 'Statement',
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondaryDocument.documentType',
      value: 'Statement',
    });

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('selectDocumentSequence');

    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'secondaryDocument',
    ]);
    expect(
      Object.keys(test.getState('validationErrors.secondaryDocument')).sort(),
    ).toEqual(['freeText']);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondaryDocument.freeText',
      value: 'Anything',
    });

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('form.documentTitle')).toEqual(
      'Motion for Leave to File Out of Time Statement Anything',
    );

    expect(test.getState('form.partyPrimary')).toEqual(true);

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'objections',
      'primaryDocumentFile',
      'secondaryDocumentFile',
    ]);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfService',
      value: true,
    });

    await test.runSequence('addSupportingDocumentToFormSequence', {
      type: 'primary',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'certificateOfServiceDate',
      'objections',
      'primaryDocumentFile',
      'secondaryDocumentFile',
      'supportingDocuments',
    ]);
    expect(test.getState('validationErrors.supportingDocuments')).toEqual([
      {
        index: 0,
        supportingDocument: 'Select a Document Type.',
      },
    ]);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'objections',
      value: 'no',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'certificateOfServiceDate',
      'primaryDocumentFile',
      'secondaryDocumentFile',
      'supportingDocuments',
    ]);
    expect(test.getState('validationErrors.certificateOfServiceDate')).toEqual(
      'Enter date for Certificate of Service.',
    );
    expect(
      Object.keys(
        test.getState('validationErrors.supportingDocuments.0'),
      ).sort(),
    ).toEqual(['index', 'supportingDocument']);
    expect(
      test.getState('validationErrors.supportingDocuments.0.index'),
    ).toEqual(0);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfServiceMonth',
      value: '12',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfServiceDay',
      value: '12',
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '5000',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'certificateOfServiceDate',
      'primaryDocumentFile',
      'secondaryDocumentFile',
      'supportingDocuments',
    ]);
    expect(test.getState('validationErrors.certificateOfServiceDate')).toEqual(
      'Certificate of Service date is in the future. Please enter a valid date.',
    );

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '2000',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'primaryDocumentFile',
      'secondaryDocumentFile',
      'supportingDocuments',
    ]);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'supportingDocuments.0.supportingDocument',
      value: 'Affidavit in Support',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'primaryDocumentFile',
      'secondaryDocumentFile',
      'supportingDocuments',
    ]);
    expect(
      Object.keys(
        test.getState('validationErrors.supportingDocuments.0'),
      ).sort(),
    ).toEqual([
      'index',
      'supportingDocumentFile',
      'supportingDocumentFreeText',
    ]);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'supportingDocuments.0.supportingDocumentFreeText',
      value: 'Affidavit in Support',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'primaryDocumentFile',
      'secondaryDocumentFile',
      'supportingDocuments',
    ]);
    expect(
      Object.keys(
        test.getState('validationErrors.supportingDocuments.0'),
      ).sort(),
    ).toEqual(['index', 'supportingDocumentFile']);
    expect(
      test.getState('validationErrors.supportingDocuments.0.index'),
    ).toEqual(0);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondaryDocumentFile',
      value: fakeFile,
    });
    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'supportingDocuments.0.supportingDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('addSupportingDocumentToFormSequence', {
      type: 'secondary',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'secondarySupportingDocuments',
    ]);
    expect(
      Object.keys(
        test.getState('validationErrors.secondarySupportingDocuments.0'),
      ).sort(),
    ).toEqual(['index', 'supportingDocument']);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondarySupportingDocuments.0.supportingDocument',
      value: 'Declaration in Support',
    });

    await test.runSequence('validateExternalDocumentInformationSequence');
    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'secondarySupportingDocuments',
    ]);
    expect(
      Object.keys(
        test.getState('validationErrors.secondarySupportingDocuments.0'),
      ).sort(),
    ).toEqual([
      'index',
      'supportingDocumentFile',
      'supportingDocumentFreeText',
    ]);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondarySupportingDocuments.0.supportingDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: 'secondarySupportingDocuments.0.supportingDocumentFreeText',
      value: 'Declaration in Support',
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitExternalDocumentSequence');
  });
};
