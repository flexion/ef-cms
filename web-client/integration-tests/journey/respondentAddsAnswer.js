import { VALIDATION_ERROR_MESSAGES } from '../../../shared/src/business/entities/externalDocument/ExternalDocumentInformationFactory';
import { contactPrimaryFromState } from '../helpers';

export const respondentAddsAnswer = (integrationTest, fakeFile) => {
  return it('Respondent adds an answer', async () => {
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

    const documentToSelect = {
      category: 'Answer (filed by respondent only)',
      documentTitle: 'Answer',
      documentType: 'Answer',
      eventCode: 'A',
      scenario: 'Standard',
    };

    for (const key of Object.keys(documentToSelect)) {
      await integrationTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value: documentToSelect[key],
        },
      );
    }

    await integrationTest.runSequence('validateSelectDocumentTypeSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('completeDocumentSelectSequence');

    expect(integrationTest.getState('form.documentType')).toEqual('Answer');

    expect(integrationTest.getState('form.partyPrimary')).toBeUndefined();

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
        key: 'certificateOfService',
        value: false,
      },
    );

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'attachments',
        value: false,
      },
    );

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'hasSupportingDocuments',
        value: false,
      },
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

    await integrationTest.runSequence('submitExternalDocumentSequence');

    expect(integrationTest.getState('caseDetail.docketEntries').length).toEqual(
      4,
    );
  });
};
