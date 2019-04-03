const { PetitionWithoutFiles } = require('./PetitionWithoutFiles');

describe('PetitionWithoutFiles entity', () => {
  describe('isValid', () => {
    it('assigns a new irsNoticeDate if one is not passed in', () => {
      const petition = new PetitionWithoutFiles({
        caseType: 'other',
        contactPrimary: {
          address1: '99 South Oak Lane',
          address2: 'Culpa numquam saepe ',
          address3: 'Eaque voluptates com',
          city: 'Dignissimos voluptat',
          countryType: 'domestic',
          email: 'petitioner1@example.com',
          name: 'Priscilla Kline',
          phone: '+1 (215) 128-6587',
          postalCode: '69580',
          state: 'AR',
        },
        contactSecondary: {},
        filingType: 'Myself',
        hasIrsNotice: false,
        irsNoticeDate: null,
        partyType: 'Petitioner',
        petitionFileId: '102e29fa-bb8c-43ff-b18f-ddce9089dd80',
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'Small',
      });
      expect(petition.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
