import { CaseAssociationRequestFactory } from '../../../shared/src/business/entities/CaseAssociationRequestFactory';
import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../../src/presenter/computeds/caseDetailHeaderHelper';
import { contactPrimaryFromState, contactSecondaryFromState } from '../helpers';
import { requestAccessHelper as requestAccessHelperComputed } from '../../src/presenter/computeds/requestAccessHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const { VALIDATION_ERROR_MESSAGES } = CaseAssociationRequestFactory;

const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderHelperComputed,
);
const requestAccessHelper = withAppContextDecorator(
  requestAccessHelperComputed,
);

export const practitionerRequestsAccessToCase = (integrationTest, fakeFile) => {
  return it('Practitioner requests access to case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const headerHelper = runCompute(caseDetailHeaderHelper, {
      state: integrationTest.getState(),
    });

    expect(headerHelper.showRequestAccessToCaseButton).toBeTruthy();

    await integrationTest.runSequence('gotoRequestAccessSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const requestHelper = runCompute(requestAccessHelper, {
      state: integrationTest.getState(),
    });

    expect(requestHelper.showSecondaryParty).toBeTruthy();

    expect(contactSecondaryFromState(integrationTest).name).toEqual(
      'Jimothy Schultz',
    );

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
        value: 'Limited Entry of Appearance',
      },
    );
    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'documentTitleTemplate',
        value: 'Limited Entry of Appearance for [Petitioner Names]',
      },
    );
    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'eventCode',
        value: 'LEA',
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
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
    });

    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'primaryDocumentFile',
        value: fakeFile,
      },
    );

    await integrationTest.runSequence('validateCaseAssociationRequestSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({
      filers: VALIDATION_ERROR_MESSAGES.filers,
    });

    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'certificateOfService',
        value: true,
      },
    );

    await integrationTest.runSequence('validateCaseAssociationRequestSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1],
      filers: VALIDATION_ERROR_MESSAGES.filers,
    });

    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'certificateOfServiceMonth',
        value: '12',
      },
    );
    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'certificateOfServiceDay',
        value: '12',
      },
    );
    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'certificateOfServiceYear',
        value: '5000',
      },
    );

    await integrationTest.runSequence('validateCaseAssociationRequestSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[0].message,
      filers: VALIDATION_ERROR_MESSAGES.filers,
    });

    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'certificateOfServiceYear',
        value: '2000',
      },
    );

    await integrationTest.runSequence('validateCaseAssociationRequestSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({
      filers: VALIDATION_ERROR_MESSAGES.filers,
    });

    const contactPrimary = contactPrimaryFromState(integrationTest);
    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
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
      'Limited Entry of Appearance for Petrs. Mona Schultz & Jimothy Schultz',
    );
    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('submitCaseAssociationRequestSequence');
  });
};
