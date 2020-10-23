import { CaseAssociationRequestFactory } from '../../../shared/src/business/entities/CaseAssociationRequestFactory';

const { VALIDATION_ERROR_MESSAGES } = CaseAssociationRequestFactory;

export const practitionerRequestsAccessToCase = (test, fakeFile) => {
  return it('Practitioner requests access to case', async () => {
    await test.runSequence('gotoRequestAccessSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('reviewRequestAccessInformationSequence');

    expect(test.getState('validationErrors')).toEqual({
      documentTitleTemplate: VALIDATION_ERROR_MESSAGES.documentTitleTemplate,
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      eventCode: VALIDATION_ERROR_MESSAGES.eventCode,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      representingPrimary: VALIDATION_ERROR_MESSAGES.representingPrimary,
      scenario: VALIDATION_ERROR_MESSAGES.scenario,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'documentType',
      value: 'Limited Entry of Appearance',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'documentTitleTemplate',
      value: 'Limited Entry of Appearance for [Petitioner Names]',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'eventCode',
      value: 'LEA',
    });
    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'scenario',
      value: 'Standard',
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      representingPrimary: VALIDATION_ERROR_MESSAGES.representingPrimary,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      representingPrimary: VALIDATION_ERROR_MESSAGES.representingPrimary,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfService',
      value: true,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1],
      representingPrimary: VALIDATION_ERROR_MESSAGES.representingPrimary,
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
        VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[0].message,
      representingPrimary: VALIDATION_ERROR_MESSAGES.representingPrimary,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'certificateOfServiceYear',
      value: '2000',
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({
      representingPrimary: VALIDATION_ERROR_MESSAGES.representingPrimary,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'representingPrimary',
      value: true,
    });

    await test.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'representingSecondary',
      value: true,
    });

    await test.runSequence('validateCaseAssociationRequestSequence');
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('reviewRequestAccessInformationSequence');

    expect(test.getState('form.documentTitle')).toEqual(
      'Limited Entry of Appearance for Petrs. Mona Schultz & Jimothy Schultz',
    );
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitCaseAssociationRequestSequence');
  });
};
