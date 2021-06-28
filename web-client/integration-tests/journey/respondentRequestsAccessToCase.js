import { CaseAssociationRequestFactory } from '../../../shared/src/business/entities/CaseAssociationRequestFactory';
import { caseDetailHeaderHelper as caseDetailHeaderHelperComputed } from '../../src/presenter/computeds/caseDetailHeaderHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderHelperComputed,
);

const { VALIDATION_ERROR_MESSAGES } = CaseAssociationRequestFactory;

export const respondentRequestsAccessToCase = (integrationTest, fakeFile) => {
  return it('Respondent requests access to case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const helper = runCompute(caseDetailHeaderHelper, {
      state: integrationTest.getState(),
    });

    expect(helper.showFileFirstDocumentButton).toBeFalsy();

    await integrationTest.runSequence('gotoRequestAccessSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('reviewRequestAccessInformationSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      documentTitleTemplate: VALIDATION_ERROR_MESSAGES.documentTitleTemplate,
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      eventCode: VALIDATION_ERROR_MESSAGES.eventCode,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      scenario: VALIDATION_ERROR_MESSAGES.scenario,
    });

    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'documentType',
        value: 'Entry of Appearance',
      },
    );
    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'documentTitleTemplate',
        value: 'Entry of Appearance for [Petitioner Names]',
      },
    );
    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'eventCode',
        value: 'EA',
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
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
    });

    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'primaryDocumentFile',
        value: fakeFile,
      },
    );

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
    });

    await integrationTest.runSequence(
      'updateCaseAssociationFormValueSequence',
      {
        key: 'certificateOfServiceYear',
        value: '2000',
      },
    );

    await integrationTest.runSequence('validateCaseAssociationRequestSequence');

    await integrationTest.runSequence('validateCaseAssociationRequestSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('reviewRequestAccessInformationSequence');

    expect(integrationTest.getState('form.documentTitle')).toEqual(
      'Entry of Appearance for Respondent',
    );
    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('submitCaseAssociationRequestSequence');
  });
};
