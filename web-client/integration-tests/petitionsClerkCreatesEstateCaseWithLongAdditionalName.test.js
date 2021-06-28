import {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
} from '../../shared/src/business/entities/EntityConstants';
import { fakeFile, getTextByCount, loginAs, setupTest } from './helpers';

const integrationTest = setupTest();

describe('Petitions clerk creates Estate case with long additionalName', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  it('login as a petitions clerk and create a case', async () => {
    await integrationTest.runSequence('gotoStartCaseWizardSequence');

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'receivedAtMonth',
      value: '01',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'receivedAtDay',
      value: '01',
    });
    const receivedAtYear = '2001';
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'receivedAtYear',
      value: receivedAtYear,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'mailingDate',
      value: 'Some Day',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'caseCaption',
      value: 'A Really Large Estate',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Boise, Idaho',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'petitionFileSize',
      value: 1,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'requestForPlaceOfTrialFile',
      value: fakeFile,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'requestForPlaceOfTrialFileSize',
      value: 1,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: 'Small',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.deficiency,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'partyType',
      value: PARTY_TYPES.estate,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.countryType',
      value: COUNTRY_TYPES.INTERNATIONAL,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.country',
      value: 'Switzerland',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Daenerys Stormborn',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '123 Abc Ln',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.city',
      value: 'Cityville',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.postalCode',
      value: '23-skidoo',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '1234567890',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.secondaryName',
      value: getTextByCount(500),
    });

    await integrationTest.runSequence(
      'updatePetitionPaymentFormValueSequence',
      {
        key: 'petitionPaymentStatus',
        value: PAYMENT_STATUS.UNPAID,
      },
    );

    await integrationTest.runSequence('validatePetitionFromPaperSequence');
    expect(integrationTest.getState('alertError')).toBeUndefined();
    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('submitPetitionFromPaperSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('currentPage')).toEqual(
      'ReviewSavedPetition',
    );
  });

  it('Petitions clerk serves paper case', async () => {
    await integrationTest.runSequence('openConfirmServeToIrsModalSequence');

    await integrationTest.runSequence('serveCaseToIrsSequence');

    expect(integrationTest.getState('currentPage')).toEqual(
      'PrintPaperPetitionReceipt',
    );
  });
});
