import { CASE_TYPES_MAP } from '@shared/business/entities/EntityConstants';

export const externalUserCreatesElectronicCase = (
  cerebralTest,
  fakeFile,
  overrides?: {
    caseType?: string;
    filedBy?: string;
    preferredTrialCity?: string;
  },
) => {
  beforeAll(() => {
    global.FileReader = class {
      onload: any;
      onerror: any;
      result: any;

      constructor() {
        (this as any).onload = null;
        (this as any).onerror = null;
        (this as any).result = null;
      }

      readAsDataURL(this: any) {
        if (this.onload) {
          this.result = 'data:application/pdf;base64,ZmFrZURhdGE=';
          this.onload({ target: { result: this.result } });
        }
      }

      readAsArrayBuffer(this: any) {
        if (this.onload) {
          this.result = new ArrayBuffer(8);
          this.onload({ target: { result: this.result } });
        }
      }

      abort(this: any) {
        if (this.onerror) {
          this.onerror(new Error('FileReader aborted'));
        }
      }
    } as any;
  });

  return it('externalUser creates an electronic case', async () => {
    // STEP 1
    await cerebralTest.runSequence('updateFilingTypeSequence', {
      key: 'filingType',
      value:
        overrides?.filedBy === 'privatePractitioner'
          ? 'Petitioner and spouse'
          : 'Myself',
    });
    await cerebralTest.runSequence('updateFormValueUpdatedSequence', {
      key: 'contactPrimary.name',
      value: 'John Doe',
    });
    await cerebralTest.runSequence('updateFormValueCountryTypeSequence', {
      key: 'contactPrimary.countryType',
      type: 'contactPrimary',
      value: 'domestic',
    });
    await cerebralTest.runSequence('updateFormValueUpdatedSequence', {
      key: 'contactPrimary.address1',
      value: '123 Easy Street',
    });
    await cerebralTest.runSequence('updateFormValueUpdatedSequence', {
      key: 'contactPrimary.city',
      value: 'Jackson',
    });
    await cerebralTest.runSequence('updateFormValueUpdatedSequence', {
      key: 'contactPrimary.state',
      value: 'NJ',
    });
    await cerebralTest.runSequence('updateFormValueUpdatedSequence', {
      key: 'contactPrimary.postalCode',
      value: '08527',
    });
    await cerebralTest.runSequence('updateFormValueUpdatedSequence', {
      key: 'contactPrimary.placeOfLegalResidence',
      value: 'AK',
    });
    await cerebralTest.runSequence('updateFormValueUpdatedSequence', {
      key: 'contactPrimary.phone',
      value: '123-222-2929',
    });

    if (overrides?.filedBy === 'privatePractitioner') {
      await cerebralTest.runSequence('updateFilingTypeSequence', {
        key: 'isSpouseDeceased',
        value: 'No',
      });

      await cerebralTest.runSequence('updateFormValueUpdatedSequence', {
        key: 'contactSecondary.name',
        value: 'Test Spouse',
      });
      await cerebralTest.runSequence('updateFormValueUpdatedSequence', {
        key: 'contactSecondary.address1',
        value: '123 Abc Ln',
      });
      await cerebralTest.runSequence('updateFormValueUpdatedSequence', {
        key: 'contactSecondary.city',
        value: 'Cityville',
      });
      await cerebralTest.runSequence('updateFormValueUpdatedSequence', {
        key: 'contactSecondary.postalCode',
        value: '09827',
      });
      await cerebralTest.runSequence('updateFormValueUpdatedSequence', {
        key: 'contactSecondary.phone',
        value: '1234567890',
      });
    }

    await cerebralTest.runSequence('filePetitionCompleteStep1Sequence');

    // STEP 2:
    await cerebralTest.runSequence('setPetitionTypeSequence', {
      key: 'petitionType',
      value: 'autoGenerated',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      allowEmptyString: true,
      index: 0,
      key: 'petitionReasons',
      value: 'reason',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      allowEmptyString: true,
      index: 0,
      key: 'petitionFacts',
      value: 'fact',
    });
    await cerebralTest.runSequence('filePetitionCompleteStep2Sequence');

    // STEP3
    await cerebralTest.runSequence('setHasIrsNoticeSequence', {
      key: 'hasIrsNotice',
      value: true,
    });
    await cerebralTest.runSequence('updateIrsNoticeIndexPropertySequence', {
      key: '0',
      property: 'caseType',
      value: overrides?.caseType || CASE_TYPES_MAP.whistleblower,
    });
    await cerebralTest.runSequence('filePetitionCompleteStep3Sequence');

    // STEP 4
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: 'Regular',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: overrides?.preferredTrialCity || 'Seattle, Washington',
    });
    await cerebralTest.runSequence('filePetitionCompleteStep4Sequence');

    // STEP 5
    await cerebralTest.runSequence('updateFormValueUpdatedSequence', {
      key: 'stinFile',
      property: 'file',
      value: fakeFile,
    });
    await cerebralTest.runSequence('updateFormValueUpdatedSequence', {
      key: 'stinFileSize',
      property: 'size',
      value: 1,
    });
    await cerebralTest.runSequence('filePetitionCompleteStep5Sequence');

    // STEP 6
    await cerebralTest.runSequence('filePetitionCompleteStep6Sequence');
    await cerebralTest.runSequence('gotoDashboardSequence');
    expect(cerebralTest.getState('currentPage')).toBe('DashboardExternalUser');
    cerebralTest.docketNumber = cerebralTest.getState(
      'openCases.0.docketNumber',
    );
  });
};
