import { OBJECTIONS_OPTIONS_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { VALIDATION_ERROR_MESSAGES } from '../../../shared/src/business/entities/externalDocument/ExternalDocumentInformationFactory';
import { contactPrimaryFromState } from '../helpers';
import { fakeBlob1 } from '../../../shared/src/business/test/getFakeFile';

export const respondentAddsMotionWithBrief = (cerebralTest, overrides) => {
  return it('Respondent adds Motion with supporting Brief', async () => {
    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      category: VALIDATION_ERROR_MESSAGES.category,
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
    });

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'category',
        value: 'Motion',
      },
    );

    await cerebralTest.runSequence('validateSelectDocumentTypeSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
    });

    const documentTypeToSelectToFile = {
      category: 'Motion',
      documentTitle: 'Motion for Continuance',
      documentType: 'Motion for Continuance',
      eventCode: 'M006',
      scenario: 'Standard',
    };

    for (const [key, value] of Object.entries(documentTypeToSelectToFile)) {
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value,
        },
      );
    }

    await cerebralTest.runSequence('validateSelectDocumentTypeSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('form.documentType')).toEqual(
      'Motion for Continuance',
    );
    expect(cerebralTest.getState('form.partyPrimary')).toBeUndefined();

    await cerebralTest.runSequence('addSupportingDocumentToFormSequence', {
      type: 'primary',
    });

    const { contactId: contactPrimaryId } =
      contactPrimaryFromState(cerebralTest);

    const documentToFileDetails = {
      [`filersMap.${contactPrimaryId}`]: true,
      attachments: false,
      certificateOfService: false,
      ['supportingDocuments.0.category']: 'Supporting Document',
      ['supportingDocuments.0.documentType']: 'Brief in Support',
      ['supportingDocuments.0.previousDocument']: {
        documentTitle: cerebralTest.getState('form.documentTitle'),
        documentType: cerebralTest.getState('form.documentType'),
      },
      ['supportingDocuments.0.supportingDocument']: 'Brief in Support',
    };

    for (const [key, value] of Object.entries(documentToFileDetails)) {
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value,
        },
      );
    }

    await cerebralTest.runSequence('validateFileInputSequence', {
      file: fakeBlob1,
      locationOnForm: 'primaryDocumentFile',
    });

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      objections: VALIDATION_ERROR_MESSAGES.objections,
      supportingDocuments: [
        {
          index: 0,
          supportingDocumentFile:
            VALIDATION_ERROR_MESSAGES.supportingDocumentFile,
        },
      ],
    });

    const documentMissingRequiredFields = {
      objections: OBJECTIONS_OPTIONS_MAP.YES,
    };

    for (const [key, value] of Object.entries(documentMissingRequiredFields)) {
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value,
        },
      );
    }

    await cerebralTest.runSequence('validateFileInputSequence', {
      file: fakeBlob1,
      locationOnForm: 'supportingDocuments.0.supportingDocumentFile',
    });

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'redactionAcknowledgement',
      value: true,
    });

    await cerebralTest.runSequence('submitExternalDocumentSequence');

    expect(cerebralTest.getState('caseDetail.docketEntries').length).toEqual(
      overrides.documentCount,
    );
  });
};
