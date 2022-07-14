import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { applyStampFormHelper as applyStampFormHelperComputed } from './applyStampFormHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('applyStampFormHelper', () => {
  const CUSTOM_ORDER_MAX_LENGTH = 60;

  const { DATE_FORMATS, MOTION_STATUSES } = applicationContext.getConstants();

  const applyStampFormHelper = withAppContextDecorator(
    applyStampFormHelperComputed,
    applicationContext,
  );

  const baseState = {
    form: {},
    pdfForSigning: {},
    validationErrors: {},
  };

  describe('canSaveStampOrder', () => {
    it('should be false when the form.status is not set to either "Denied" or "Granted"', () => {
      const { canSaveStampOrder } = runCompute(applyStampFormHelper, {
        state: {
          ...baseState,
        },
      });

      expect(canSaveStampOrder).toEqual(false);
    });

    it('should be false when the stamp is not applied', () => {
      const { canSaveStampOrder } = runCompute(applyStampFormHelper, {
        state: {
          ...baseState,
          pdfForSigning: {
            stampApplied: false,
          },
        },
      });

      expect(canSaveStampOrder).toEqual(false);
    });

    it('should be true when the form.status is set and stamp is applied', () => {
      const { canSaveStampOrder } = runCompute(applyStampFormHelper, {
        state: {
          ...baseState,
          form: {
            status: MOTION_STATUSES.GRANTED,
          },
          pdfForSigning: {
            stampApplied: true,
          },
        },
      });

      expect(canSaveStampOrder).toEqual(true);
    });
  });

  describe('cursorClass', () => {
    it('should be "cursor-grabbing" when the stamp has been applied and there is no stamp data', () => {
      const { cursorClass } = runCompute(applyStampFormHelper, {
        state: {
          ...baseState,
          pdfForSigning: {
            stampApplied: true,
            stampData: undefined,
          },
        },
      });

      expect(cursorClass).toEqual('cursor-grabbing');
    });

    it('should be "cursor-grab" when the stamp has NOT been applied and there is stamp data', () => {
      const { cursorClass } = runCompute(applyStampFormHelper, {
        state: {
          ...baseState,
          pdfForSigning: {
            stampApplied: false,
            stampData: {},
          },
        },
      });

      expect(cursorClass).toEqual('cursor-grab');
    });
  });

  describe('customOrderTextCharacterCount', () => {
    it('should return CUSTOM_ORDER_MAX_LENGTH if customOrderText is not set', () => {
      const { customOrderTextCharacterCount } = runCompute(
        applyStampFormHelper,
        {
          state: {
            ...baseState,
            form: {
              customOrderText: '',
            },
          },
        },
      );
      expect(customOrderTextCharacterCount).toEqual(CUSTOM_ORDER_MAX_LENGTH);
    });

    it('should return the CUSTOM_ORDER_MAX_LENGTH - customOrderText.length if customOrderText is set', () => {
      const fourLetterWord = 'cool';
      const { customOrderTextCharacterCount } = runCompute(
        applyStampFormHelper,
        {
          state: {
            ...baseState,
            form: {
              customOrderText: fourLetterWord,
            },
          },
        },
      );

      expect(customOrderTextCharacterCount).toEqual(
        CUSTOM_ORDER_MAX_LENGTH - fourLetterWord.length,
      );
    });
  });

  describe('hideClass', () => {
    it('should be empty when the stamp has been applied and the pdf has not already been stamped', () => {
      const { hideClass } = runCompute(applyStampFormHelper, {
        state: {
          ...baseState,
          pdfForSigning: {
            isPdfAlreadyStamped: false,
            stampApplied: true,
          },
        },
      });

      expect(hideClass).toEqual('');
    });

    it('should be "hide" when the stamp has NOT been applied and the pdf has already been signed', () => {
      const { hideClass } = runCompute(applyStampFormHelper, {
        state: {
          ...baseState,
          pdfForSigning: {
            isPdfAlreadyStamped: true,
            stampApplied: false,
          },
        },
      });

      expect(hideClass).toEqual('hide');
    });
  });

  describe('minDate', () => {
    it('should be set to todays date formatted as "YYYY-MM-DD"', () => {
      const mockDate = '1765-09-23';
      applicationContext.getUtilities().formatNow.mockReturnValue(mockDate);

      const { minDate } = runCompute(applyStampFormHelper, {
        state: baseState,
      });

      expect(minDate).toEqual(minDate);
      expect(applicationContext.getUtilities().formatNow).toHaveBeenCalledWith(
        DATE_FORMATS.YYYYMMDD,
      );
    });
  });

  describe('dateErrorClass', () => {
    it('should be set to "stamp-form-group" if there are no validationErrors on date', () => {
      const { dateErrorClass } = runCompute(applyStampFormHelper, {
        state: baseState,
      });

      expect(dateErrorClass).toEqual('stamp-form-group');
    });

    it('should be set to "stamp-form-group-error" if there are validationErrors on date', () => {
      const { dateErrorClass } = runCompute(applyStampFormHelper, {
        state: {
          ...baseState,
          validationErrors: {
            date: true,
          },
        },
      });

      expect(dateErrorClass).toEqual('stamp-form-group-error');
    });
  });

  describe('statusErrorClass', () => {
    it('should be set to "stamp-form-group" if there are no validationErrors on status', () => {
      const { statusErrorClass } = runCompute(applyStampFormHelper, {
        state: baseState,
      });

      expect(statusErrorClass).toEqual('stamp-form-group');
    });

    it('should be set to "stamp-form-group-error" if there are validationErrors on status', () => {
      const { statusErrorClass } = runCompute(applyStampFormHelper, {
        state: {
          ...baseState,
          validationErrors: {
            status: true,
          },
        },
      });

      expect(statusErrorClass).toEqual('stamp-form-group-error');
    });
  });
});
