import { runCompute } from 'cerebral/test';

import startCaseHelper from '../../src/presenter/computeds/startCaseHelper';

export default (test, fakeFile) => {
  return it('Taxpayer creates a new case', async () => {
    await test.runSequence('updatePetitionValueSequence', {
      key: 'petitionFile',
      value: fakeFile,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'month',
      value: '01',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'day',
      value: '00',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'year',
      value: '2001',
    });

    let result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeFalsy();
    expect(result.showSecondaryContact).toBeFalsy();

    // Petitioner party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Myself',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Test Person',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '123 Abc Ln',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address2',
      value: 'Apt 2',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.city',
      value: 'Cityville',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.state',
      value: 'CA',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.zip',
      value: '12345',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.email',
      value: 'test@example.com',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '1234567890',
    });

    expect(test.getState('form.contactPrimary')).toEqual({
      name: 'Test Person',
      address1: '123 Abc Ln',
      address2: 'Apt 2',
      city: 'Cityville',
      state: 'CA',
      zip: '12345',
      email: 'test@example.com',
      phone: '1234567890',
    });

    // Petitioner & Spouse party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Myself and my spouse',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPetitionerDeceasedSpouseForm).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'isSpouseDeceased',
      value: 'No',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // Petitioner & Deceased Spouse party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Myself and my spouse',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPetitionerDeceasedSpouseForm).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'isSpouseDeceased',
      value: 'Yes',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
    expect(result.showOwnershipDisclosure).toBeFalsy();

    // Corporation party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'A business',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showBusinessFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'businessType',
      value: 'Corporation',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showOwnershipDisclosure).toBeTruthy();

    // Partnership tax matters party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'A business',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showBusinessFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'businessType',
      value: 'Partnership (as the tax matters partner)',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();
    expect(result.showOwnershipDisclosure).toBeTruthy();

    await test.runSequence('submitFilePetitionSequence');

    expect(test.getState('alertError').messages).toContain(
      'Ownership Disclosure Statement is required.',
    );

    await test.runSequence('updatePetitionValueSequence', {
      key: 'ownershipDisclosureFile',
      value: fakeFile,
    });

    await test.runSequence('submitFilePetitionSequence');
    expect(test.getState('alertError').messages[0]).not.toContain(
      'Ownership Disclosure Statement is required.',
    );

    // Partnership other than tax matters party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'A business',
    });

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'hasIrsNotice',
      value: false,
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showBusinessFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'businessType',
      value: 'Partnership (as a partner other than tax matters partner)',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // Partnership BBA party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'A business',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showBusinessFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'businessType',
      value:
        'Partnership (as a partnership representative under the BBA regime)',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // Estate with executor party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();
    expect(result.showOwnershipDisclosure).toBeFalsy();
    expect(test.getState('petition.ownershipDisclosureFile')).toBeUndefined();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'An estate or trust',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showEstateFilingOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'estateType',
      value: 'Estate with an Executor/Personal Representative/Fiduciary/etc.',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // Estate without executor party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'An estate or trust',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showEstateFilingOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'estateType',
      value:
        'Estate without an Executor/Personal Representative/Fiduciary/etc.',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();

    // trust and trustee party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'An estate or trust',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showEstateFilingOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'estateType',
      value: 'Trust',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // conservator party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'A minor or incompetent person',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showMinorIncompetentFilingOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'minorIncompetentType',
      value: 'Conservator',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // guardian party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'A minor or incompetent person',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showMinorIncompetentFilingOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'minorIncompetentType',
      value: 'Guardian',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // custodian party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'A minor or incompetent person',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showMinorIncompetentFilingOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'minorIncompetentType',
      value: 'Custodian',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // minor party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'A minor or incompetent person',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showMinorIncompetentFilingOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'minorIncompetentType',
      value:
        'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // incompetent person party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'A minor or incompetent person',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showMinorIncompetentFilingOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'minorIncompetentType',
      value:
        'Next Friend for an Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    // donor party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'Donor',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();

    // transferee party type primary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'Transferee',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();

    // surviving spouse party type primary/secondary contact
    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'filingType',
      value: 'Other',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showOtherFilingTypeOptions).toBeTruthy();

    await test.runSequence('updateStartCaseFormValueSequence', {
      key: 'otherType',
      value: 'Deceased Spouse',
    });

    result = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(result.showPrimaryContact).toBeTruthy();
    expect(result.showSecondaryContact).toBeTruthy();

    await test.runSequence('submitFilePetitionSequence');

    expect(test.getState('alertError.title')).toEqual(
      'Please correct the following errors on the page:',
    );

    await test.runSequence('updateFormValueSequence', {
      key: 'day',
      value: '01',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.name',
      value: 'Test Person',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.address1',
      value: '123 Abc Ln',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.address2',
      value: 'Apt 2',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.city',
      value: 'Cityville',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.state',
      value: 'CA',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.zip',
      value: '12345',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.email',
      value: 'test@example.com',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactSecondary.phone',
      value: '1234567890',
    });

    expect(test.getState('form.contactSecondary')).toEqual({
      name: 'Test Person',
      address1: '123 Abc Ln',
      address2: 'Apt 2',
      city: 'Cityville',
      state: 'CA',
      zip: '12345',
      email: 'test@example.com',
      phone: '1234567890',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'Test Person',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '123 Abc Ln',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address2',
      value: 'Apt 2',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.city',
      value: 'Cityville',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.state',
      value: 'CA',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.zip',
      value: '12345',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.email',
      value: 'test@example.com',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '1234567890',
    });
    expect(test.getState('form.contactPrimary')).toEqual({
      name: 'Test Person',
      address1: '123 Abc Ln',
      address2: 'Apt 2',
      city: 'Cityville',
      state: 'CA',
      zip: '12345',
      email: 'test@example.com',
      phone: '1234567890',
    });

    // try without checking the signature
    await test.runSequence('submitFilePetitionSequence');
    expect(test.getState('alertError.title')).toEqual(
      'Please correct the following errors on the page:',
    );

    // click the signature and try again
    await test.runSequence('updateFormValueSequence', {
      key: 'signature',
      value: true,
    });

    await test.runSequence('submitFilePetitionSequence');
    expect(test.getState('alertError')).toEqual(null);

    expect(test.getState('alertSuccess')).toEqual({
      title: 'Your petition has been successfully submitted.',
      message: 'You can access your case at any time from the case list below.',
    });
  });
};
