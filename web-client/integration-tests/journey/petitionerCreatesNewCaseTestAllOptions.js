import { Case } from '../../../shared/src/business/entities/cases/Case';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from 'cerebral/test';
import { startCaseHelper as startCaseHelperComputed } from '../../src/presenter/computeds/startCaseHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const startCaseHelper = withAppContextDecorator(startCaseHelperComputed);

const { VALIDATION_ERROR_MESSAGES } = Case;
const { CASE_TYPES_MAP, COUNTRY_TYPES, PARTY_TYPES } =
  applicationContext.getConstants();

export const petitionerCreatesNewCaseTestAllOptions = (
  integrationTest,
  fakeFile,
  overrides = {},
) => {
  return it('petitioner creates a new case, testing all form options', async () => {
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'petitionFileSize',
      value: 1,
    });

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'stinFile',
      value: fakeFile,
    });

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'stinFileSize',
      value: 1,
    });

    let result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeFalsy();
    expect(result.showSecondaryContact).toBeFalsy();

    // Petitioner party type primary contact with international address
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Myself',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();

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
      key: 'contactPrimary.email',
      value: 'test@example.com',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '1234567890',
    });

    expect(integrationTest.getState('form.contactPrimary')).toEqual({
      address1: '123 Abc Ln',
      city: 'Cityville',
      country: 'Switzerland',
      countryType: COUNTRY_TYPES.INTERNATIONAL,
      email: 'test@example.com',
      name: 'Daenerys Stormborn',
      phone: '1234567890',
      postalCode: '23-skidoo',
    });

    // Petitioner party type primary contact
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Myself',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.countryType',
      value: COUNTRY_TYPES.DOMESTIC,
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
      key: 'contactPrimary.address2',
      value: 'Apt 2',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.city',
      value: 'Cityville',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.state',
      value: 'CA',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.postalCode',
      value: '12345',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.email',
      value: 'test@example.com',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '1234567890',
    });

    expect(integrationTest.getState('form.contactPrimary')).toEqual({
      address1: '123 Abc Ln',
      address2: 'Apt 2',
      city: 'Cityville',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'test@example.com',
      name: 'Daenerys Stormborn',
      phone: '1234567890',
      postalCode: '12345',
      state: 'CA',
    });

    // Petitioner & Spouse party type primary/secondary contact
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Myself and my spouse',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPetitionerDeceasedSpouseForm).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'isSpouseDeceased',
      value: 'No',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // Petitioner & Deceased Spouse party type primary/secondary contact
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Myself and my spouse',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPetitionerDeceasedSpouseForm).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'isSpouseDeceased',
      value: 'Yes',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
    expect(result.showOwnershipDisclosure).toBeFalsy();

    // Corporation party type primary contact
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'A business',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showBusinessFilingTypeOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'businessType',
      value: PARTY_TYPES.corporation,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showOwnershipDisclosure).toBeTruthy();

    // Partnership tax matters party type primary contact
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'A business',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showBusinessFilingTypeOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'businessType',
      value: PARTY_TYPES.partnershipAsTaxMattersPartner,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
    expect(result.showOwnershipDisclosure).toBeTruthy();

    await integrationTest.runSequence('submitFilePetitionSequence');

    expect(integrationTest.getState('alertError').messages).toContain(
      VALIDATION_ERROR_MESSAGES.ownershipDisclosureFile,
    );

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'ownershipDisclosureFile',
      value: fakeFile,
    });

    await integrationTest.runSequence('submitFilePetitionSequence');
    expect(integrationTest.getState('alertError').messages[0]).not.toContain(
      VALIDATION_ERROR_MESSAGES.ownershipDisclosureFile,
    );

    // Partnership other than tax matters party type primary contact
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'A business',
    });

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'hasIrsNotice',
      value: false,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showBusinessFilingTypeOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'businessType',
      value: PARTY_TYPES.partnershipOtherThanTaxMatters,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // Partnership BBA party type primary contact
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'A business',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showBusinessFilingTypeOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'businessType',
      value: PARTY_TYPES.partnershipBBA,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // Estate with executor party type primary contact
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();
    expect(result.showOwnershipDisclosure).toBeFalsy();
    expect(
      integrationTest.getState('petition.ownershipDisclosureFile'),
    ).toBeUndefined();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'An estate or trust',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showEstateFilingOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'estateType',
      value: PARTY_TYPES.estate,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // Estate without executor party type primary contact
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'An estate or trust',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showEstateFilingOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'estateType',
      value: PARTY_TYPES.estateWithoutExecutor,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();

    // trust and trustee party type primary contact
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'An estate or trust',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showEstateFilingOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'estateType',
      value: PARTY_TYPES.trust,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // conservator party type primary contact
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'A minor or legally incompetent person',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showMinorIncompetentFilingOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'minorIncompetentType',
      value: PARTY_TYPES.conservator,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // guardian party type primary contact
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'A minor or legally incompetent person',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showMinorIncompetentFilingOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'minorIncompetentType',
      value: PARTY_TYPES.guardian,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // custodian party type primary contact
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'A minor or legally incompetent person',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showMinorIncompetentFilingOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'minorIncompetentType',
      value: PARTY_TYPES.custodian,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // minor party type primary contact
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'A minor or legally incompetent person',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showMinorIncompetentFilingOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'minorIncompetentType',
      value: PARTY_TYPES.nextFriendForMinor,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // legally incompetent person party type primary contact
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'A minor or legally incompetent person',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showMinorIncompetentFilingOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'minorIncompetentType',
      value: PARTY_TYPES.nextFriendForIncompetentPerson,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();

    // donor party type primary contact
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: PARTY_TYPES.donor,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();

    // transferee party type primary contact
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: PARTY_TYPES.transferee,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(integrationTest.getState('form.partyType')).toEqual(
      PARTY_TYPES.transferee,
    );

    // surviving spouse party type primary contact
    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: CASE_TYPES_MAP.other,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'Deceased Spouse',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeFalsy();
    expect(integrationTest.getState('form.partyType')).toEqual(
      PARTY_TYPES.survivingSpouse,
    );

    await integrationTest.runSequence('submitFilePetitionSequence');

    expect(integrationTest.getState('alertError.title')).toEqual(
      'Please correct the following errors on the page:',
    );

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'day',
      value: '01',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Daenerys Stormborn',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.secondaryName',
      value: 'Daenerys Stormborn 2',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '123 Abc Ln',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address2',
      value: 'Apt 2',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.city',
      value: 'Cityville',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.state',
      value: 'CA',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.postalCode',
      value: '12345',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.email',
      value: 'test@example.com',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '1234567890',
    });
    expect(integrationTest.getState('form.contactPrimary')).toEqual({
      address1: '123 Abc Ln',
      address2: 'Apt 2',
      city: 'Cityville',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'test@example.com',
      name: 'Daenerys Stormborn',
      phone: '1234567890',
      postalCode: '12345',
      secondaryName: 'Daenerys Stormborn 2',
      state: 'CA',
    });

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'hasIrsNotice',
      value: false,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showHasIrsNoticeOptions).toBeFalsy();
    expect(result.showNotHasIrsNoticeOptions).toBeTruthy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'hasIrsNotice',
      value: true,
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showHasIrsNoticeOptions).toBeTruthy();
    expect(result.showNotHasIrsNoticeOptions).toBeFalsy();

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'caseType',
      value: overrides.caseType || CASE_TYPES_MAP.whistleblower,
    });

    expect(integrationTest.getState('form.contactPrimary')).toEqual({
      address1: '123 Abc Ln',
      address2: 'Apt 2',
      city: 'Cityville',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'test@example.com',
      name: 'Daenerys Stormborn',
      phone: '1234567890',
      postalCode: '12345',
      secondaryName: 'Daenerys Stormborn 2',
      state: 'CA',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'wizardStep',
      value: '5',
    });

    await integrationTest.runSequence('submitFilePetitionSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});
    expect(integrationTest.getState('alertError')).toBeUndefined();

    expect(integrationTest.getState('currentPage')).toBe('FilePetitionSuccess');

    await integrationTest.runSequence('gotoDashboardSequence');

    expect(integrationTest.getState('currentPage')).toBe('DashboardPetitioner');
  });
};
