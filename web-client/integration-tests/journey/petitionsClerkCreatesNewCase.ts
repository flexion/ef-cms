import {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
} from '../../../shared/src/business/entities/EntityConstants';
import { CaseInternal } from '../../../shared/src/business/entities/cases/CaseInternal';
import { fakeBlob1 } from '../../../shared/src/business/test/getFakeFile';

export const petitionsClerkCreatesNewCase = (
  cerebralTest,
  overrides?: {
    procedureType?: string;
    receivedAtDay?: string;
    receivedAtMonth?: string;
    receivedAtYear?: string;
    shouldServe?: boolean;
    trialLocation?: string;
  },
) => {
  const defaults = {
    procedureType: 'Small',
    receivedAtDay: '01',
    receivedAtMonth: '01',
    receivedAtYear: '2001',
    shouldServe: true,
    trialLocation: 'Birmingham, Alabama',
  };
  overrides = Object.assign(defaults, overrides || {});
  const { VALIDATION_ERROR_MESSAGES } = CaseInternal;

  return it('Petitions clerk creates a new case', async () => {
    await cerebralTest.runSequence('gotoStartCaseWizardSequence');
    expect(cerebralTest.getState('form.hasVerifiedIrsNotice')).toEqual(false);

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(cerebralTest.getState('alertError.title')).toEqual(
      'Please correct the following errors on the page:',
    );

    expect(cerebralTest.getState('validationErrors.caseCaption')).toEqual(
      VALIDATION_ERROR_MESSAGES.caseCaption,
    );

    expect(cerebralTest.getState('validationErrors.receivedAt')).toEqual(
      VALIDATION_ERROR_MESSAGES.receivedAt[1],
    );

    expect(cerebralTest.getState('validationErrors.petitionFile')).toEqual(
      VALIDATION_ERROR_MESSAGES.petitionFile,
    );

    expect(
      cerebralTest.getState('validationErrors.requestForPlaceOfTrialFile'),
    ).toBeUndefined();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'receivedAtMonth',
      value: overrides.receivedAtMonth,
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'receivedAtDay',
      value: overrides.receivedAtDay,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'receivedAtYear',
      value: overrides.receivedAtYear,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'mailingDate',
      value: 'Some Day',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseCaption',
      value:
        'Daenerys Stormborn, Deceased, Daenerys Stormborn, Surviving Spouse, Petitioner',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: overrides.trialLocation,
    });

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      cerebralTest.getState('validationErrors.requestForPlaceOfTrialFile'),
    ).toEqual(VALIDATION_ERROR_MESSAGES.requestForPlaceOfTrialFile);

    await cerebralTest.runSequence('validateFileInputSequence', {
      file: fakeBlob1,
      theNameOfTheFileOnTheEntity: 'petitionFile',
    });

    await cerebralTest.runSequence('validateFileInputSequence', {
      file: fakeBlob1,
      theNameOfTheFileOnTheEntity: 'stinFile',
    });

    await cerebralTest.runSequence('validateFileInputSequence', {
      file: fakeBlob1,
      theNameOfTheFileOnTheEntity: 'corporateDisclosureFile',
    });

    await cerebralTest.runSequence('validateFileInputSequence', {
      file: fakeBlob1,
      theNameOfTheFileOnTheEntity: 'requestForPlaceOfTrialFile',
    });

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      cerebralTest.getState('validationErrors.requestForPlaceOfTrialFile'),
    ).toBeUndefined();

    await cerebralTest.runSequence('validateFileInputSequence', {
      file: fakeBlob1,
      theNameOfTheFileOnTheEntity: 'applicationForWaiverOfFilingFeeFile',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: overrides.procedureType,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.deficiency,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'partyType',
      value: PARTY_TYPES.petitioner,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.countryType',
      value: COUNTRY_TYPES.INTERNATIONAL,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.country',
      value: 'Switzerland',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Daenerys Stormborn',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '123 Abc Ln',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.city',
      value: 'Cityville',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.postalCode',
      value: '23-skidoo',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '1234567890',
    });

    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: PAYMENT_STATUS.PAID,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'paymentDateDay',
      value: '01',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'paymentDateMonth',
      value: '01',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'paymentDateYear',
      value: '2001',
    });

    await cerebralTest.runSequence('updatePetitionPaymentFormValueSequence', {
      key: 'petitionPaymentMethod',
      value: 'Money, I guess',
    });

    await cerebralTest.runSequence('validatePetitionFromPaperSequence');
    expect(cerebralTest.getState('alertError')).toBeUndefined();
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('submitPetitionFromPaperSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('ReviewSavedPetition');

    const docketNumber = cerebralTest.getState('caseDetail.docketNumber');
    const receivedDocketNumberYear = docketNumber.slice(-2);
    const expectedDocketNumberYear = overrides.receivedAtYear.slice(-2);
    expect(receivedDocketNumberYear).toBe(expectedDocketNumberYear);

    if (overrides.shouldServe) {
      await cerebralTest.runSequence('serveCaseToIrsSequence');
    }

    await cerebralTest.runSequence('gotoCaseDetailSequence');

    cerebralTest.docketNumber = cerebralTest.getState(
      'caseDetail.docketNumber',
    );
    expect(cerebralTest.getState('caseDetail.preferredTrialCity')).toEqual(
      overrides.trialLocation,
    );
    if (cerebralTest.casesReadyForTrial) {
      cerebralTest.casesReadyForTrial.push(cerebralTest.docketNumber);
    }
  });
};
