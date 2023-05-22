import {
  contactPrimaryFromState,
  fakeEncryptedFile,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

describe('Petitioner files an encrypted document', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner3@example.com');
  it('login as a petitioner and create a case', async () => {
    const { docketNumber } = await uploadPetition(
      cerebralTest,
      {},
      'petitioner3@example.com',
    );

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'petitioner3@example.com');
  it('petitioner attempts to file an answer on their case, uploading an encrypted PDF', async () => {
    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const { contactId } = contactPrimaryFromState(cerebralTest);
    const answerFormValues = {
      category: 'Answer',
      certificateOfService: false,
      documentTitle: 'Answer - PDF is Encrypted',
      documentType: 'Answer',
      eventCode: 'A',
      hasSupportingDocuments: false,
      [`filersMap.${contactId}`]: true,
      scenario: 'Standard',
    };

    for (let [key, value] of Object.entries(answerFormValues)) {
      await cerebralTest.runSequence(
        'updateFileDocumentWizardFormValueSequence',
        {
          key,
          value,
        },
      );
    }

    await cerebralTest.runSequence('validateFileInputSequence', {
      file: fakeEncryptedFile,
      locationOnForm: 'primaryDocumentFile',
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({
      primaryDocumentPDF:
        'The file you are trying to upload may be encrypted or password protected. Remove the password or encryption and try again.',
    });

    // await cerebralTest.runSequence('reviewExternalDocumentInformationSequence');

    // expect(cerebralTest.getState('validationErrors')).toEqual({
    //   primaryDocumentPDF:
    //     'The file you are trying to upload may be encrypted or password protected. Remove the password or encryption and try again.',
    // });
  });
});
