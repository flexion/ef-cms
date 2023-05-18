import { CASE_TYPES_MAP, COUNTRY_TYPES, PARTY_TYPES } from '../EntityConstants';
import { CaseExternal } from './CaseExternal';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('CaseExternal', () => {
  describe('for Corporation Contacts', () => {
    it('should not validate without contact', () => {
      const caseExternalEntity = new CaseExternal(
        {
          caseType: CASE_TYPES_MAP.other,
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: '2009-10-13',
          partyType: PARTY_TYPES.corporation,
          petitionFile: { size: 1 },
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
          signature: true,
          stinFile: { size: 1 },
        },
        { applicationContext },
      );

      expect(caseExternalEntity.isValid()).toEqual(false);
    });

    it('should not validate without inCareOf', () => {
      const caseExternalEntity = new CaseExternal(
        {
          caseType: CASE_TYPES_MAP.other,
          contactPrimary: {
            address1: '876 12th Ave',
            city: 'Nashville',
            country: 'USA',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'someone@example.com',
            name: 'Jimmy Dean',
            phone: '1234567890',
            postalCode: '05198',
            state: 'AK',
          },
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: '2009-10-13',
          partyType: PARTY_TYPES.corporation,
          petitionFile: { size: 1 },
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
          signature: true,
        },
        { applicationContext },
      );

      expect(caseExternalEntity.isValid()).toEqual(false);
    });

    it('can validate primary contact', () => {
      const caseExternalEntity = new CaseExternal(
        {
          caseType: CASE_TYPES_MAP.other,
          contactPrimary: {
            address1: '876 12th Ave',
            city: 'Nashville',
            country: 'USA',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'someone@example.com',
            inCareOf: 'USTC',
            name: 'Jimmy Dean',
            phone: '1234567890',
            postalCode: '05198',
            state: 'AK',
          },
          filingType: 'Myself',
          hasIrsNotice: true,
          irsNoticeDate: '2009-10-13',
          partyType: PARTY_TYPES.corporation,
          petitionFile: { size: 1 },
          preferredTrialCity: 'Memphis, Tennessee',
          procedureType: 'Small',
          signature: true,
          stinFile: { size: 1 },
        },
        { applicationContext },
      );

      expect(caseExternalEntity.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
