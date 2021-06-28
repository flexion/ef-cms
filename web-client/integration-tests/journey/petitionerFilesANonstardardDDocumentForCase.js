import { contactPrimaryFromState } from '../helpers';
import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionerFilesANonstardardDDocumentForCase = (
  integrationTest,
  fakeFile,
) => {
  return it('Petitioner files a nonstandard d document for case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const documentToSelect = {
      category: 'Miscellaneous',
      documentTitle: 'Certificate of Service of [Document Name] [Date]',
      documentType: 'Certificate of Service',
      eventCode: 'CS',
      scenario: 'Nonstandard D',
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
        key: 'primaryDocumentFile',
        value: fakeFile,
      },
    );

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'serviceDateMonth',
        value: '03',
      },
    );

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'serviceDateDay',
        value: '03',
      },
    );

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'serviceDateYear',
        value: '2003',
      },
    );

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: 'previousDocument',
        value: integrationTest.previousDocumentId,
      },
    );

    await integrationTest.runSequence('validateSelectDocumentTypeSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('completeDocumentSelectSequence');

    expect(integrationTest.getState('form.documentType')).toEqual(
      'Certificate of Service',
    );

    runCompute(withAppContextDecorator(formattedCaseDetail), {
      state: integrationTest.getState(),
    });

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

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('submitExternalDocumentSequence');
  });
};
