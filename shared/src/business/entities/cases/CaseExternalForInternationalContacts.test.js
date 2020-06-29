const { CaseExternal } = require('./CaseExternal');
const { ContactFactory } = require('../contacts/ContactFactory');
const { PARTY_TYPES } = require('../EntityConstants');

const contactErrorMessages =
  ContactFactory.INTERNATIONAL_VALIDATION_ERROR_MESSAGES;

describe('CaseExternal', () => {
  describe('for (international) Contacts', () => {
    it('should not validate without country', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        contactPrimary: {
          address1: '876 12th Ave',
          city: 'Nashville',
          countryType: 'international',
          email: 'someone@example.com',
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          state: 'AK',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: PARTY_TYPES.petitioner,
        petitionFile: new File(['mockFileContents'], 'mockFileName.pdf'),
        petitionFileSize: 1,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
        signature: true,
        stinFile: new File(['mockFileContents'], 'mockFileName.pdf'),
        stinFileSize: 1,
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual({
        contactPrimary: { country: contactErrorMessages.country },
      });
    });

    it('can validate primary contact', () => {
      const caseExternal = new CaseExternal({
        caseType: 'Other',
        contactPrimary: {
          address1: '876 12th Ave',
          city: 'Nashville',
          country: 'USA',
          countryType: 'international',
          email: 'someone@example.com',
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          state: 'AK',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        partyType: PARTY_TYPES.petitioner,
        petitionFile: new File(['mockFileContents'], 'mockFileName.pdf'),
        petitionFileSize: 1,
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Small',
        signature: true,
        stinFile: new File(['mockFileContents'], 'mockFileName.pdf'),
        stinFileSize: 1,
      });
      expect(caseExternal.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
