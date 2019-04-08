export default test => {
  return it('Taxpayer files document for case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoFileDocumentSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({
      category: 'You must select a category.',
      documentType: 'You must select a document type.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'category',
      value: 'Answer (filed by respondent only)',
    });

    await test.runSequence('validateSelectDocumentTypeSequence');
    expect(test.getState('validationErrors')).toEqual({
      documentType: 'You must select a document type.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'documentType',
      value: 'Answer',
    });

    await test.runSequence('validateSelectDocumentTypeSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('form.documentType')).toEqual(
      'Answer (filed by respondent only)',
    );

    await test.runSequence('editSelectedDocumentSequence');

    await test.runSequence('updateFormValueSequence', {
      key: 'category',
      value: 'Motion',
    });

    // await test.runSequence('validateSelectDocumentTypeSequence');

    // expect(test.getState('validationErrors')).toEqual({
    //   documentType: 'You must select a document type.',
    // });

    await test.runSequence('updateFormValueSequence', {
      key: 'documentType',
      value: 'Motion for Leave to File [Document Name]',
    });

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({
      secondaryDocument: {
        category: 'You must select a category.',
        documentType: 'You must select a document type.',
      },
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'secondaryDocument.category',
      value: 'Statement',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'secondaryDocument.documentType',
      value: 'Statement [anything]',
    });

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({
      secondaryDocument: {
        freeText: 'You must provide a value.',
      },
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'secondaryDocument.freeText',
      value: 'Anything',
    });

    await test.runSequence('selectDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('form.documentTitle')).toEqual(
      'Motion for Leave to File Statement Anything',
    );
  });
};
