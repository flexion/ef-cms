import { CaseAssociationRequestFactory } from '../../../shared/src/business/entities/CaseAssociationRequestFactory';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { contactSecondaryFromState } from '../helpers';

export const practitionerRequestsPendingAccessToCase = (
  integrationTest,
  fakeFile,
) => {
  const { VALIDATION_ERROR_MESSAGES } = CaseAssociationRequestFactory;
  const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

  return it('Practitioner requests access to pending case', async () => {
    await integrationTest.runSequence('gotoRequestAccessSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('reviewRequestAccessInformationSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      documentTitleTemplate: VALIDATION_ERROR_MESSAGES.documentTitleTemplate,
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      eventCode: VALIDATION_ERROR_MESSAGES.eventCode,
      filers: VALIDATION_ERROR_MESSAGES.filers,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      scenario: VALIDATION_ERROR_MESSAGES.scenario,
    });

    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'documentType',
        value: 'Motion to Substitute Parties and Change Caption',
      },
    );
    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'documentTitleTemplate',
        value: 'Motion to Substitute Parties and Change Caption',
      },
    );
    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'eventCode',
        value: 'M107',
      },
    );
    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'scenario',
        value: 'Standard',
      },
    );

    await integrationTest.runSequence('validateCaseAssociationRequestSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({
      filers: VALIDATION_ERROR_MESSAGES.filers,
      objections: VALIDATION_ERROR_MESSAGES.objections,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
    });

    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'certificateOfService',
        value: false,
      },
    );

    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'objections',
        value: OBJECTIONS_OPTIONS_MAP.NO,
      },
    );

    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'attachments',
        value: false,
      },
    );

    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'primaryDocumentFile',
        value: fakeFile,
      },
    );

    const contactSecondary = contactSecondaryFromState(integrationTest);
    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: `filersMap.${contactSecondary.contactId}`,
        value: true,
      },
    );

    await integrationTest.runSequence('validateCaseAssociationRequestSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('reviewRequestAccessInformationSequence');

    expect(integrationTest.getState('form.documentTitle')).toEqual(
      'Motion to Substitute Parties and Change Caption',
    );
    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('wizardStep')).toBe('RequestAccessReview');

    await integrationTest.runSequence('submitCaseAssociationRequestSequence');

    expect(integrationTest.getState('wizardStep')).toBeUndefined();
  });
};
