const Petition = require('./Petition');

describe('Petition', () => {
  describe('for Petitioner And Spouse Contacts', () => {
    it('should not validate without contacts', () => {
      const petition = new Petition({
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        preferredTrialCity: 'Chattanooga, TN',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        petitionFile: {},
        signature: true,
        partyType: 'Petitioner & Spouse',
      });
      expect(petition.isValid()).toEqual(false);
    });

    it('can validate primary contact name', () => {
      const petition = new Petition({
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        preferredTrialCity: 'Chattanooga, TN',
        hasIrsNotice: true,
        irsNoticeDate: '2009-10-13',
        petitionFile: {},
        signature: true,
        partyType: 'Petitioner & Spouse',
        contactPrimary: {
          countryType: 'domestic',
          name: 'Jimmy Dean',
          address1: '876 12th Ave',
          city: 'Nashville',
          state: 'AK',
          postalCode: '05198',
          country: 'USA',
          phone: '1234567890',
          email: 'someone@example.com',
        },
        contactSecondary: {
          countryType: 'domestic',
          name: 'Betty Crocker',
          address1: '1599 Pennsylvania Ave',
          city: 'Walla Walla',
          state: 'WA',
          postalCode: '78774',
          phone: '1234567890',
          email: 'someone@example.com',
        },
      });
      expect(petition.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
