import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { contactPrimaryFromState } from '../helpers';

export const petitionerFilesApplicationToTakeDeposition = (
  integrationTest,
  fakeFile,
) => {
  return it('Petitioner files an application to take deposition', async () => {
    const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const documentToSelect = {
      category: 'Application',
      documentTitle: 'Application to Take Deposition of [Name]',
      documentType: 'Application to Take Deposition',
      eventCode: 'APLD',
      scenario: 'Nonstandard B',
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

    await integrationTest.runSequence('completeDocumentSelectSequence');

    expect(integrationTest.getState('form.documentType')).toEqual(
      documentToSelect.documentType,
    );

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'primaryDocumentFile',
        value: fakeFile,
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
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'certificateOfService',
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

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'objections',
        value: OBJECTIONS_OPTIONS_MAP.NO,
      },
    );

    await integrationTest.runSequence(
      'reviewExternalDocumentInformationSequence',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('submitExternalDocumentSequence');
  });
};
