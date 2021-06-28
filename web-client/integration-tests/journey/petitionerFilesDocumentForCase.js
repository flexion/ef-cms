import { VALIDATION_ERROR_MESSAGES } from '../../../shared/src/business/entities/externalDocument/ExternalDocumentInformationFactory';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { contactPrimaryFromState } from '../helpers';

export const petitionerFilesDocumentForCase = (integrationTest, fakeFile) => {
  const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

  return it('petitioner files document for case', async () => {
    await integrationTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('completeDocumentSelectSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      category: VALIDATION_ERROR_MESSAGES.category,
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
    });

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'category',
        value: 'Answer (filed by respondent only)',
      },
    );

    await integrationTest.runSequence('validateSelectDocumentTypeSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
    });

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'documentType',
        value: 'Answer',
      },
    );
    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'documentTitle',
        value: 'Answer',
      },
    );
    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'eventCode',
        value: 'A',
      },
    );
    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'scenario',
        value: 'Standard',
      },
    );

    await integrationTest.runSequence('validateSelectDocumentTypeSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('completeDocumentSelectSequence');

    expect(integrationTest.getState('form.documentType')).toEqual('Answer');

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'category',
        value: 'Motion',
      },
    );

    await integrationTest.runSequence('completeDocumentSelectSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
    });

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'documentType',
        value: 'Motion for Leave to File Out of Time',
      },
    );
    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'documentTitle',
        value: 'Motion for Leave to File Out of Time [Document Name]',
      },
    );
    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'eventCode',
        value: 'M014',
      },
    );
    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'scenario',
        value: 'Nonstandard H',
      },
    );

    await integrationTest.runSequence('completeDocumentSelectSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      secondaryDocument: {
        category: VALIDATION_ERROR_MESSAGES.category,
        documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      },
    });

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondaryDocument.category',
        value: 'Statement',
      },
    );

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondaryDocument.documentType',
        value: 'Statement',
      },
    );
    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondaryDocument.documentTitle',
        value: 'Statement [anything]',
      },
    );
    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondaryDocument.eventCode',
        value: 'STAT',
      },
    );
    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondaryDocument.scenario',
        value: 'Nonstandard B',
      },
    );

    await integrationTest.runSequence('completeDocumentSelectSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      secondaryDocument: {
        freeText: VALIDATION_ERROR_MESSAGES.freeText[0].message,
      },
    });

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondaryDocument.freeText',
        value: 'Anything',
      },
    );

    await integrationTest.runSequence('completeDocumentSelectSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('form.documentTitle')).toEqual(
      'Motion for Leave to File Out of Time Statement Anything',
    );

    const contactPrimary = contactPrimaryFromState(integrationTest);

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await integrationTest.runSequence(
      'reviewExternalDocumentInformationSequence',
    );

    expect(integrationTest.getState('form.filers')).toEqual([
      contactPrimary.contactId,
    ]);

    expect(integrationTest.getState('validationErrors')).toEqual({
      objections: VALIDATION_ERROR_MESSAGES.objections,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      secondaryDocumentFile: VALIDATION_ERROR_MESSAGES.secondaryDocumentFile,
    });

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'certificateOfService',
        value: true,
      },
    );

    await integrationTest.runSequence('addSupportingDocumentToFormSequence', {
      type: 'primary',
    });

    await integrationTest.runSequence(
      'validateExternalDocumentInformationSequence',
    );
    expect(integrationTest.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1],
      objections: VALIDATION_ERROR_MESSAGES.objections,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      secondaryDocumentFile: VALIDATION_ERROR_MESSAGES.secondaryDocumentFile,
      supportingDocuments: [
        {
          index: 0,
          supportingDocument: VALIDATION_ERROR_MESSAGES.supportingDocument,
        },
      ],
    });

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'objections',
        value: OBJECTIONS_OPTIONS_MAP.NO,
      },
    );

    await integrationTest.runSequence(
      'validateExternalDocumentInformationSequence',
    );
    expect(integrationTest.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1],
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      secondaryDocumentFile: VALIDATION_ERROR_MESSAGES.secondaryDocumentFile,
      supportingDocuments: [
        {
          index: 0,
          supportingDocument: VALIDATION_ERROR_MESSAGES.supportingDocument,
        },
      ],
    });

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'certificateOfServiceMonth',
        value: '12',
      },
    );
    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'certificateOfServiceDay',
        value: '12',
      },
    );
    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'certificateOfServiceYear',
        value: '5000',
      },
    );

    await integrationTest.runSequence(
      'validateExternalDocumentInformationSequence',
    );
    expect(integrationTest.getState('validationErrors')).toEqual({
      certificateOfServiceDate:
        VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[0].message,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      secondaryDocumentFile: VALIDATION_ERROR_MESSAGES.secondaryDocumentFile,
      supportingDocuments: [
        {
          index: 0,
          supportingDocument: VALIDATION_ERROR_MESSAGES.supportingDocument,
        },
      ],
    });

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'certificateOfServiceYear',
        value: '2000',
      },
    );

    await integrationTest.runSequence(
      'validateExternalDocumentInformationSequence',
    );
    expect(integrationTest.getState('validationErrors')).toEqual({
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      secondaryDocumentFile: VALIDATION_ERROR_MESSAGES.secondaryDocumentFile,
      supportingDocuments: [
        {
          index: 0,
          supportingDocument: VALIDATION_ERROR_MESSAGES.supportingDocument,
        },
      ],
    });

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'supportingDocuments.0.category',
        value: 'Supporting Document',
      },
    );
    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'supportingDocuments.0.documentType',
        value: 'Affidavit in Support',
      },
    );

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'supportingDocuments.0.previousDocument',
        value: {
          documentTitle: integrationTest.getState('form.documentTitle'),
          documentType: integrationTest.getState('form.documentType'),
        },
      },
    );
    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'supportingDocuments.0.supportingDocument',
        value: 'Affidavit in Support',
      },
    );

    await integrationTest.runSequence(
      'validateExternalDocumentInformationSequence',
    );
    expect(integrationTest.getState('validationErrors')).toEqual({
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      secondaryDocumentFile: VALIDATION_ERROR_MESSAGES.secondaryDocumentFile,
      supportingDocuments: [
        {
          index: 0,
          supportingDocumentFile:
            VALIDATION_ERROR_MESSAGES.supportingDocumentFile,
          supportingDocumentFreeText:
            VALIDATION_ERROR_MESSAGES.supportingDocumentFreeText,
        },
      ],
    });

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'supportingDocuments.0.supportingDocumentFreeText',
        value: 'Affidavit in Support',
      },
    );

    await integrationTest.runSequence(
      'validateExternalDocumentInformationSequence',
    );
    expect(integrationTest.getState('validationErrors')).toEqual({
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
      secondaryDocumentFile: VALIDATION_ERROR_MESSAGES.secondaryDocumentFile,
      supportingDocuments: [
        {
          index: 0,
          supportingDocumentFile:
            VALIDATION_ERROR_MESSAGES.supportingDocumentFile,
        },
      ],
    });

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'primaryDocumentFile',
        value: fakeFile,
      },
    );
    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondaryDocumentFile',
        value: fakeFile,
      },
    );
    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'supportingDocuments.0.supportingDocumentFile',
        value: fakeFile,
      },
    );

    await integrationTest.runSequence(
      'validateExternalDocumentInformationSequence',
    );
    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('addSupportingDocumentToFormSequence', {
      type: 'secondary',
    });

    await integrationTest.runSequence(
      'validateExternalDocumentInformationSequence',
    );
    expect(integrationTest.getState('validationErrors')).toEqual({
      secondarySupportingDocuments: [
        {
          index: 0,
          supportingDocument: VALIDATION_ERROR_MESSAGES.supportingDocument,
        },
      ],
    });

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondarySupportingDocuments.0.category',
        value: 'Supporting Document',
      },
    );
    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondarySupportingDocuments.0.documentType',
        value: 'Declaration in Support',
      },
    );
    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondarySupportingDocuments.0.previousDocument',
        value: {
          documentTitle: integrationTest.getState(
            'form.secondaryDocument.documentTitle',
          ),
          documentType: integrationTest.getState(
            'form.secondaryDocument.documentType',
          ),
        },
      },
    );
    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondarySupportingDocuments.0.supportingDocument',
        value: 'Declaration in Support',
      },
    );

    await integrationTest.runSequence(
      'validateExternalDocumentInformationSequence',
    );
    expect(integrationTest.getState('validationErrors')).toEqual({
      secondarySupportingDocuments: [
        {
          index: 0,
          supportingDocumentFile:
            VALIDATION_ERROR_MESSAGES.supportingDocumentFile,
          supportingDocumentFreeText:
            VALIDATION_ERROR_MESSAGES.supportingDocumentFreeText,
        },
      ],
    });

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondarySupportingDocuments.0.supportingDocumentFile',
        value: fakeFile,
      },
    );

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'secondarySupportingDocuments.0.supportingDocumentFreeText',
        value: 'Declaration in Support',
      },
    );

    await integrationTest.runSequence(
      'reviewExternalDocumentInformationSequence',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('submitExternalDocumentSequence');
  });
};
