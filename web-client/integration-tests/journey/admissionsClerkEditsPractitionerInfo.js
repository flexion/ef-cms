const { refreshElasticsearchIndex } = require('../helpers');

export const admissionsClerkEditsPractitionerInfo = integrationTest => {
  return it('admissions clerk edits practitioner information', async () => {
    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: integrationTest.barNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'EditPractitionerUser',
    );
    expect(integrationTest.getState('form.barNumber')).toEqual(
      integrationTest.barNumber,
    );

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'firstName',
      value: 'Ben',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'middleName',
      value: 'Leighton',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'lastName',
      value: 'Matlock',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: '123 Legal Way',
    });

    await integrationTest.runSequence('submitUpdatePractitionerUserSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex(5000);

    expect(integrationTest.getState('currentPage')).toEqual(
      'PractitionerDetail',
    );
    expect(integrationTest.getState('practitionerDetail.barNumber')).toEqual(
      integrationTest.barNumber,
    );
    expect(integrationTest.getState('practitionerDetail.name')).toEqual(
      'Ben Leighton Matlock',
    );
    expect(
      integrationTest.getState('practitionerDetail.contact.address1'),
    ).toEqual('123 Legal Way');

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const caseDetail = integrationTest.getState('caseDetail');
    const noticeDocument = caseDetail.docketEntries.find(
      document => document.documentType === 'Notice of Change of Address',
    );

    expect(noticeDocument).toBeTruthy();
    expect(noticeDocument.additionalInfo).toEqual('for Ben Leighton Matlock');
  });
};
