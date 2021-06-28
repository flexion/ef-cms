import { CaseInternal } from '../../../shared/src/business/entities/cases/CaseInternal';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

const { VALIDATION_ERROR_MESSAGES } = CaseInternal;

const { CASE_TYPES_MAP, COUNTRY_TYPES, PARTY_TYPES, PAYMENT_STATUS } =
  applicationContext.getConstants();

export const petitionsClerkCreatesNewCase = (
  integrationTest,
  fakeFile,
  trialLocation = 'Birmingham, Alabama',
  shouldServe = true,
) => {
  return it('Petitions clerk creates a new case', async () => {
    await integrationTest.runSequence('gotoStartCaseWizardSequence');
    expect(integrationTest.getState('form.hasVerifiedIrsNotice')).toEqual(
      false,
    );

    await integrationTest.runSequence('submitPetitionFromPaperSequence');

    expect(integrationTest.getState('alertError.title')).toEqual(
      'Please correct the following errors on the page:',
    );

    expect(integrationTest.getState('validationErrors.caseCaption')).toEqual(
      VALIDATION_ERROR_MESSAGES.caseCaption,
    );

    expect(integrationTest.getState('validationErrors.receivedAt')).toEqual(
      VALIDATION_ERROR_MESSAGES.receivedAt[1],
    );

    expect(integrationTest.getState('validationErrors.petitionFile')).toEqual(
      VALIDATION_ERROR_MESSAGES.petitionFile,
    );

    expect(
      integrationTest.getState('validationErrors.requestForPlaceOfTrialFile'),
    ).toBeUndefined();

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
      value:
        'Daenerys Stormborn, Deceased, Daenerys Stormborn, Surviving Spouse, Petitioner',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: trialLocation,
    });

    await integrationTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      integrationTest.getState('validationErrors.requestForPlaceOfTrialFile'),
    ).toEqual(VALIDATION_ERROR_MESSAGES.requestForPlaceOfTrialFile);

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'petitionFileSize',
      value: 1,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'stinFile',
      value: fakeFile,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'stinFileSize',
      value: 1,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'ownershipDisclosureFile',
      value: fakeFile,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'ownershipDisclosureFileSize',
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

    await integrationTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      integrationTest.getState('validationErrors.requestForPlaceOfTrialFile'),
    ).toBeUndefined();

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'applicationForWaiverOfFilingFeeFile',
      value: fakeFile,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'applicationForWaiverOfFilingFeeFileSize',
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
      value: PARTY_TYPES.petitioner,
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

    expect(integrationTest.getState('currentPage')).toEqual(
      'ReviewSavedPetition',
    );

    const docketNumber = integrationTest.getState('caseDetail.docketNumber');
    const receivedDocketNumberYear = docketNumber.slice(-2);
    const expectedDocketNumberYear = receivedAtYear.slice(-2);
    expect(receivedDocketNumberYear).toBe(expectedDocketNumberYear);

    if (shouldServe) {
      await integrationTest.runSequence('serveCaseToIrsSequence');
    }

    await integrationTest.runSequence('gotoCaseDetailSequence');

    integrationTest.docketNumber = integrationTest.getState(
      'caseDetail.docketNumber',
    );
    expect(integrationTest.getState('caseDetail.preferredTrialCity')).toEqual(
      trialLocation,
    );
    if (integrationTest.casesReadyForTrial) {
      integrationTest.casesReadyForTrial.push(integrationTest.docketNumber);
    }
  });
};
