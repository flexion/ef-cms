export default (test, fakeFile) => {
  return it('Respondent requests access to case', async () => {
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
      'scenario',
    ]);

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'documentType',
      value: 'Entry of Appearance',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'documentTitleTemplate',
      value: 'Entry of Appearance for [Petitioner Names]',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'eventCode',
      value: 'EA',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'scenario',
      value: 'Standard',
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'certificateOfService',
      'primaryDocumentFile',
    ]);

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'certificateOfService',
    ]);

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfService',
      value: true,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfServiceDate: 'Enter a Certificate of Service Date.',
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfServiceMonth',
      value: '12',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfServiceDay',
      value: '12',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '5000',
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        'Certificate of Service date is in the future. Please enter a valid date.',
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '2000',
    });

    await test.runSequence('validateCaseAssociationRequestSequence');

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('reviewRequestAccessInformationSequence');

    expect(test.getState('form.documentTitle')).toEqual(
      'Entry of Appearance for Respondent',
    );
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitCaseAssociationRequestSequence');
  });
};
