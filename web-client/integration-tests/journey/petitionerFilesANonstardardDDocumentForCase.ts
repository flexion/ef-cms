import { contactPrimaryFromState } from '../helpers';

export const petitionerFilesANonstardardDDocumentForCase = (
  cerebralTest,
  fakeFile,
) => {
  return it('Petitioner files a nonstandard d document for case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const { contactId: contactPrimaryId } =
      contactPrimaryFromState(cerebralTest);

    const documentToFileDetails = {
      category: 'Miscellaneous',
      certificateOfService: false,
      documentTitle: 'Certificate of Service of [Document Name] [Date]',
      documentType: 'Certificate of Service',
      eventCode: 'CS',
      hasSupportingDocuments: false,
      previousDocument: cerebralTest.previousDocumentId,
      primaryDocumentFile: fakeFile,
      primaryDocumentFileSize: 1,
      scenario: 'Nonstandard D',
      serviceDateDay: '03',
      serviceDateMonth: '03',
      serviceDateYear: '2003',
      [`filersMap.${contactPrimaryId}`]: true,
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

    await cerebralTest.runSequence('validateSelectDocumentTypeSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('completeDocumentSelectSequence');

    expect(cerebralTest.getState('form.documentType')).toEqual(
      'Certificate of Service',
    );

    await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'redactionAcknowledgement',
      value: true,
    });

    await cerebralTest.runSequence('submitExternalDocumentSequence');
  });
};
