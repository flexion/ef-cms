export default (test, fakeFile) => {
  return it('Respondent adds an answer', async () => {
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

    expect(test.getState('form.documentType')).toEqual('Answer');

    await test.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'certificateOfService',
      value: false,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'exhibits',
      value: false,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'attachments',
      value: false,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'hasSupportingDocuments',
      value: false,
    });

    await test.runSequence('reviewExternalDocumentInformationSequence');

    await test.runSequence('submitExternalDocumentSequence');

    expect(test.getState('caseDetail.documents').length).toEqual(3);
  });
};
