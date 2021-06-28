import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { startCaseHelper as startCaseHelperComputed } from '../../src/presenter/computeds/startCaseHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const startCaseHelper = withAppContextDecorator(startCaseHelperComputed);
const { CASE_TYPES_MAP, COUNTRY_TYPES } = applicationContext.getConstants();

export const practitionerCreatesNewCase = (integrationTest, fakeFile) => {
  return it('Practitioner creates a new case', async () => {
    await integrationTest.runSequence('gotoStartCaseWizardSequence');
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
      value: 'Petitioner and spouse',
    });

    await integrationTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'isSpouseDeceased',
      value: 'No',
    });

    result = runCompute(startCaseHelper, {
      state: integrationTest.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

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

    expect(integrationTest.getState('form.contactPrimary')).toEqual({
      address1: '123 Abc Ln',
      city: 'Cityville',
      country: 'Switzerland',
      countryType: COUNTRY_TYPES.INTERNATIONAL,
      name: 'Daenerys Stormborn',
      phone: '1234567890',
      postalCode: '23-skidoo',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.countryType',
      value: COUNTRY_TYPES.INTERNATIONAL,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.country',
      value: 'Switzerland',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.name',
      value: 'Test Spouse',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.address1',
      value: '123 Abc Ln',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.city',
      value: 'Cityville',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.postalCode',
      value: '23-skidoo',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.phone',
      value: '1234567890',
    });

    expect(integrationTest.getState('form.contactSecondary')).toEqual({
      address1: '123 Abc Ln',
      city: 'Cityville',
      country: 'Switzerland',
      countryType: COUNTRY_TYPES.INTERNATIONAL,
      name: 'Test Spouse',
      phone: '1234567890',
      postalCode: '23-skidoo',
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

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.whistleblower,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'month',
      value: '01',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'day',
      value: '01',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'year',
      value: '2001',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: 'Small',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Seattle, Washington',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.whistleblower,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'wizardStep',
      value: '5',
    });

    await integrationTest.runSequence('submitFilePetitionSequence');

    expect(integrationTest.getState('alertError')).toBeUndefined();

    expect(integrationTest.getState('currentPage')).toBe('FilePetitionSuccess');

    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoDashboardSequence');

    expect(integrationTest.getState('currentPage')).toBe(
      'DashboardPractitioner',
    );

    integrationTest.docketNumber = integrationTest.getState(
      'openCases.0.docketNumber',
    );
  });
};
