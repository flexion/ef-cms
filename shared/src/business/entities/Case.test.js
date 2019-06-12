const moment = require('moment');
const {
  Case,
  ANSWER_CUTOFF_AMOUNT,
  ANSWER_CUTOFF_UNIT,
  STATUS_TYPES,
} = require('./Case');
const { DocketRecord } = require('./DocketRecord');
const { MOCK_CASE } = require('../../test/mockCase');
const { PARTY_TYPES } = require('./contacts/PetitionContact');
const { WorkItem } = require('./WorkItem');

describe('Case entity', () => {
  it('defaults the orders to false', () => {
    const myCase = new Case(MOCK_CASE);
    expect(myCase).toMatchObject({
      noticeOfAttachments: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: false,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: false,
    });
  });

  it('sets the expected order booleans', () => {
    const myCase = new Case({
      ...MOCK_CASE,
      noticeOfAttachments: true,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: true,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: true,
    });
    expect(myCase).toMatchObject({
      noticeOfAttachments: true,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: true,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: true,
    });
  });

  describe('isValid', () => {
    it('Creates a valid case', () => {
      const myCase = new Case(MOCK_CASE);
      expect(myCase.isValid()).toBeTruthy();
    });

    it('Creates a valid case from an already existing case json', () => {
      const myCase = new Case(MOCK_CASE);
      expect(myCase.isValid()).toBeTruthy();
    });

    it('adds a paygov date to an already existing case json', () => {
      const myCase = new Case({ payGovId: '1234', ...MOCK_CASE });
      expect(myCase.isValid()).toBeTruthy();
    });

    it('Creates an invalid case with a document', () => {
      const myCase = new Case({
        documents: [
          {
            documentId: '123',
            documentType: 'testing',
          },
        ],
        petitioners: [{ name: 'Test Taxpayer' }],
      });
      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with no documents', () => {
      const myCase = new Case({
        documents: [],
      });
      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with empty object', () => {
      const myCase = new Case({});
      expect(myCase.isValid()).toBeFalsy();
    });

    it('Creates an invalid case with no petitioners', () => {
      const myCase = new Case({
        petitioners: [],
      });
      expect(myCase.isValid()).toBeFalsy();
    });

    it('creates a case with year amounts', () => {
      const myCase = new Case({
        petitioners: [],
        yearAmounts: [
          { amount: '34.50', year: '2000' },
          { amount: '34.50', year: '2001' },
        ],
      });
      expect(myCase.isValid()).toBeFalsy();
    });

    it('should not be valid because of duplicate years in yearAmounts', () => {
      const isValid = new Case({
        ...MOCK_CASE,
        yearAmounts: [
          {
            amount: '34.50',
            year: '2000',
          },
          {
            amount: '100.50',
            year: '2000',
          },
        ],
      }).isValid();
      expect(isValid).toBeFalsy();
    });
  });

  describe('areYearsUnique', () => {
    it('will fail validation when having two year amounts with the same year', () => {
      const isValid = Case.areYearsUnique([
        {
          amount: '34.50',
          year: '2000',
        },
        {
          amount: '34.50',
          year: '2000',
        },
      ]);
      expect(isValid).toBeFalsy();
    });
  });

  describe('validate', () => {
    it('should do nothing if valid', () => {
      let error;
      try {
        new Case(MOCK_CASE).validate();
      } catch (err) {
        error = err;
      }
      expect(error).not.toBeDefined();
    });

    it('should throw an error on invalid cases', () => {
      let error;
      try {
        new Case({}).validate();
      } catch (err) {
        error = err;
      }
      expect(error).toBeDefined();
    });
  });

  describe('isValidCaseId', () => {
    it('returns true if a valid uuid', () => {
      expect(
        Case.isValidCaseId('c54ba5a9-b37b-479d-9201-067ec6e335bb'),
      ).toBeTruthy();
    });

    it('returns false if a invalid uuid', () => {
      expect(
        Case.isValidCaseId('XXX54ba5a9-b37b-479d-9201-067ec6e335bb'),
      ).toBeFalsy();
    });
  });

  describe('isValidDocketNumber', () => {
    it('returns true if a valid docketNumber', () => {
      expect(Case.isValidDocketNumber('00101-00')).toBeTruthy();
    });

    it('returns false if a invalid docketnumber', () => {
      expect(Case.isValidDocketNumber('00')).toBeFalsy();
    });
  });

  describe('markAsSentToIRS', () => {
    it('sets irsSendDate', () => {
      const caseRecord = new Case(MOCK_CASE);
      caseRecord.markAsSentToIRS('2018-12-04T18:27:13.370Z');
      expect(caseRecord.irsSendDate).toBeDefined();
    });
    it('updates docket record status on petition documents', () => {
      const caseRecord = new Case({
        ...MOCK_CASE,
        docketRecord: [
          {
            description: 'Petition',
            documentId: '123',
            filedBy: 'Test Petitioner',
            filingDate: '2019-03-01T21:42:29.073Z',
          },
          {
            description:
              'Request for Place of Trial at Charleston, West Virginia',
            filingDate: '2019-03-01T21:42:29.073Z',
          },
        ],
      });
      caseRecord.markAsSentToIRS('2018-12-04T18:27:13.370Z');
      expect(caseRecord.irsSendDate).toBeDefined();
      expect(caseRecord.docketRecord[0].status).toMatch(/^R served on/);
      expect(caseRecord.docketRecord[1].status).toBeUndefined();
    });
  });

  describe('getCaseCaption', () => {
    it('party type Petitioner', () => {
      const caseTitle = Case.getCaseCaption(MOCK_CASE);
      expect(caseTitle).toEqual('Test Taxpayer, Petitioner');
    });

    it('party type Petitioner & Spouse', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.petitionerSpouse,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual('Test Taxpayer & Test Taxpayer 2, Petitioners');
    });

    it('party type Petitioner & Deceased Spouse', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer & Test Taxpayer 2, Deceased, Test Taxpayer, Surviving Spouse, Petitioners',
      );
    });

    it('party type Estate with an Executor/Personal Representative/Fiduciary/etc.', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.estate,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Estate of Test Taxpayer 2, Deceased, Test Taxpayer, Executor, Petitioner(s)',
      );
    });

    it('party type Estate without an Executor/Personal Representative/Fiduciary/etc.', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.estateWithoutExecutor,
      });
      expect(caseTitle).toEqual(
        'Estate of Test Taxpayer, Deceased, Petitioner',
      );
    });

    it('party type Trust', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.trust,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, Trustee, Petitioner(s)',
      );
    });

    it('party type Corporation', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.corporation,
      });
      expect(caseTitle).toEqual('Test Taxpayer, Petitioner');
    });

    it('party type Partnership Tax Matters', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.partnershipAsTaxMattersPartner,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, Tax Matters Partner, Petitioner',
      );
    });

    it('party type Partnership Other Than Tax Matters', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.partnershipOtherThanTaxMatters,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, A Partner Other Than the Tax Matters Partner, Petitioner',
      );
    });

    it('party type Partnership BBA', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.partnershipBBA,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, Partnership Representative, Petitioner(s)',
      );
    });

    it('party type Conservator', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.conservator,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, Conservator, Petitioner',
      );
    });

    it('party type Guardian', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.guardian,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, Guardian, Petitioner',
      );
    });

    it('party type Custodian', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.custodian,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Test Taxpayer, Custodian, Petitioner',
      );
    });

    it('party type Minor', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.nextFriendForMinor,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Minor, Test Taxpayer, Next Friend, Petitioner',
      );
    });

    it('party type Legally Incompetent Person', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.nextFriendForIncompetentPerson,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Incompetent, Test Taxpayer, Next Friend, Petitioner',
      );
    });

    it('party type Donor', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.donor,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual('Test Taxpayer, Donor, Petitioner');
    });

    it('party type Transferee', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.transferee,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual('Test Taxpayer, Transferee, Petitioner');
    });

    it('party type Surviving Spouse', () => {
      const caseTitle = Case.getCaseCaption({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.survivingSpouse,
        contactSecondary: {
          name: 'Test Taxpayer 2',
        },
      });
      expect(caseTitle).toEqual(
        'Test Taxpayer 2, Deceased, Test Taxpayer, Surviving Spouse, Petitioner',
      );
    });
  });

  describe('getCaseCaptionNames', () => {
    it('party type Petitioner', () => {
      const caseCaptionNames = Case.getCaseCaptionNames(
        'Test Taxpayer, Petitioner',
      );
      expect(caseCaptionNames).toEqual('Test Taxpayer');
    });

    it('party type Petitioner & Spouse', () => {
      const caseCaptionNames = Case.getCaseCaptionNames(
        'Test Taxpayer & Test Taxpayer 2, Petitioners',
      );
      expect(caseCaptionNames).toEqual('Test Taxpayer & Test Taxpayer 2');
    });

    it('party type Estate with an Executor/Personal Representative/Fiduciary/etc.', () => {
      const caseCaptionNames = Case.getCaseCaptionNames(
        'Estate of Test Taxpayer 2, Deceased, Test Taxpayer, Executor, Petitioner(s)',
      );
      expect(caseCaptionNames).toEqual(
        'Estate of Test Taxpayer 2, Deceased, Test Taxpayer, Executor',
      );
    });
  });

  describe('sendToIRSHoldingQueue', () => {
    it('sets status for irs batch', () => {
      const caseRecord = new Case(MOCK_CASE);
      caseRecord.sendToIRSHoldingQueue();
      expect(caseRecord.status).toEqual('Batched for IRS');
    });
  });

  describe('markAsPaidByPayGov', () => {
    it('sets pay gov fields', () => {
      const caseRecord = new Case(MOCK_CASE);
      caseRecord.markAsPaidByPayGov(new Date().toISOString());
      expect(caseRecord.payGovDate).toBeDefined();
    });

    it('should add item to docket record when paid', () => {
      const caseRecord = new Case(MOCK_CASE);
      const payGovDate = new Date().toISOString();
      const initialDocketLength =
        (caseRecord.docketRecord && caseRecord.docketRecord.length) || 0;
      caseRecord.markAsPaidByPayGov(payGovDate);
      const docketLength = caseRecord.docketRecord.length;
      expect(docketLength).toEqual(initialDocketLength + 1);
    });

    it('should only set docket record once per time paid', () => {
      const caseRecord = new Case(MOCK_CASE);
      caseRecord.markAsPaidByPayGov(new Date().toISOString());
      const docketLength = caseRecord.docketRecord.length;
      caseRecord.markAsPaidByPayGov(new Date().toISOString());
      caseRecord.markAsPaidByPayGov(new Date('2019-01-01').toISOString());
      caseRecord.markAsPaidByPayGov(new Date('2019-01-01').toISOString());
      expect(docketLength).toEqual(caseRecord.docketRecord.length);
    });

    it('should overwrite existing docket record entry if one already exists', () => {
      const caseRecord = new Case(MOCK_CASE);
      caseRecord.addDocketRecord(
        new DocketRecord({
          description: 'Some Description',
          filingDate: new Date().toISOString(),
        }),
      );
      caseRecord.addDocketRecord(
        new DocketRecord({
          description: 'Filing fee paid',
          filingDate: new Date().toISOString(),
        }),
      );
      caseRecord.markAsPaidByPayGov(new Date().toISOString());
      expect(caseRecord.docketRecord.length).toEqual(2);
    });
  });

  describe('setRequestForTrialDocketRecord', () => {
    it('sets request for trial docket record when it does not already exist', () => {
      const caseRecord = new Case(MOCK_CASE);
      const preferredTrialCity = 'Mobile, Alabama';
      const initialDocketLength =
        (caseRecord.docketRecord && caseRecord.docketRecord.length) || 0;
      caseRecord.setRequestForTrialDocketRecord(preferredTrialCity);
      const docketLength = caseRecord.docketRecord.length;
      expect(docketLength).toEqual(initialDocketLength + 1);
    });

    it('should only set docket record once for request for trial', () => {
      const caseRecord = new Case(MOCK_CASE);
      const preferredTrialCity = 'Mobile, Alabama';
      caseRecord.setRequestForTrialDocketRecord(preferredTrialCity);
      const docketLength = caseRecord.docketRecord.length;
      caseRecord.setRequestForTrialDocketRecord('Birmingham, Alabama');
      caseRecord.setRequestForTrialDocketRecord('Somecity, USA');
      expect(docketLength).toEqual(caseRecord.docketRecord.length);
    });
  });

  describe('addDocketRecord', () => {
    it('adds a new docketrecord', () => {
      const caseRecord = new Case(MOCK_CASE);
      caseRecord.addDocketRecord(
        new DocketRecord({
          description: 'test',
          filingDate: new Date().toISOString(),
          index: 5,
        }),
      );

      expect(caseRecord.docketRecord).toHaveLength(1);
      expect(caseRecord.docketRecord[0].description).toEqual('test');
      expect(caseRecord.docketRecord[0].index).toEqual(5);

      caseRecord.addDocketRecord(
        new DocketRecord({
          description: 'sdfs',
          filingDate: new Date().toISOString(),
        }),
      );

      expect(caseRecord.docketRecord[1].index).toEqual(6);
    });
    it('validates the docketrecord', () => {
      const caseRecord = new Case(MOCK_CASE);
      caseRecord.addDocketRecord(new DocketRecord({ description: 'test' }));
      let error;
      try {
        caseRecord.validate();
      } catch (err) {
        error = err;
      }
      expect(error).toBeTruthy();
    });
  });

  describe('validateWithError', () => {
    it('passes back an error passed in if invalid', () => {
      let error = null;
      const caseRecord = new Case({});
      try {
        caseRecord.validateWithError(new Error('Imarealerror'));
      } catch (e) {
        error = e;
      }
      expect(error).toBeDefined();
      expect(error.message).toContain('Imarealerror');
    });

    it('does not pass back an error passed in if valid', () => {
      let error;
      const caseRecord = new Case(MOCK_CASE);
      try {
        caseRecord.validateWithError(new Error('Imarealerror'));
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeDefined();
    });
  });

  describe('getCaseTypes', () => {
    it('returns the case types for hasIrsNotice true', () => {
      const caseTypes = Case.getCaseTypes(true);
      expect(caseTypes).not.toBeNull();
      expect(caseTypes.length).toBeGreaterThan(1);
    });
    it('returns the case types for hasIrsNotice false', () => {
      const caseTypes = Case.getCaseTypes(false);
      expect(caseTypes).not.toBeNull();
      expect(caseTypes.length).toBeGreaterThan(1);
    });
  });

  describe('attachRespondent', () => {
    it('adds the user to the respondents', () => {
      const caseToVerify = new Case({});
      caseToVerify.attachRespondent({
        user: {
          userId: 'respondent',
        },
      });
      expect(caseToVerify.respondent).not.toBeNull();
      expect(caseToVerify.respondent.userId).toEqual('respondent');
    });
  });

  describe('attachPractitioner', () => {
    it('adds the user to the practitioners', () => {
      const caseToVerify = new Case({});
      caseToVerify.attachPractitioner({
        user: {
          userId: 'practitioner',
        },
      });
      expect(caseToVerify.practitioners).not.toBeNull();
      expect(caseToVerify.practitioners[0].userId).toEqual('practitioner');
    });
  });

  describe('addDocument', () => {
    it('attaches the document to the case', () => {
      const caseToVerify = new Case({});
      caseToVerify.addDocument({
        documentId: '123',
        documentType: 'Answer',
        userId: 'respondent',
      });
      expect(caseToVerify.documents.length).toEqual(1);
      expect(caseToVerify.documents[0]).toMatchObject({
        documentId: '123',
        documentType: 'Answer',
        userId: 'respondent',
      });
    });
  });

  describe('getProcedureTypes', () => {
    it('returns the procedure types', () => {
      const procedureTypes = Case.getProcedureTypes();
      expect(procedureTypes).not.toBeNull();
      expect(procedureTypes.length).toEqual(2);
      expect(procedureTypes[0]).toEqual('Regular');
      expect(procedureTypes[1]).toEqual('Small');
    });
  });

  describe('getFilingTypes', () => {
    it('returns the filing types for user role petitioner', () => {
      const filingTypes = Case.getFilingTypes('petitioner');
      expect(filingTypes).not.toBeNull();
      expect(filingTypes.length).toEqual(4);
      expect(filingTypes[0]).toEqual('Myself');
    });

    it('returns the filing types for user role petitioner as default', () => {
      const filingTypes = Case.getFilingTypes();
      expect(filingTypes).not.toBeNull();
      expect(filingTypes.length).toEqual(4);
      expect(filingTypes[0]).toEqual('Myself');
    });

    it('returns the filing types for user role petitioner for unknown role', () => {
      const filingTypes = Case.getFilingTypes('whodat');
      expect(filingTypes).not.toBeNull();
      expect(filingTypes.length).toEqual(4);
      expect(filingTypes[0]).toEqual('Myself');
    });

    it('returns the filing types for user role practitioner', () => {
      const filingTypes = Case.getFilingTypes('practitioner');
      expect(filingTypes).not.toBeNull();
      expect(filingTypes.length).toEqual(4);
      expect(filingTypes[0]).toEqual('Individual petitioner');
    });
  });

  describe('docket record suffix changes', () => {
    it('should save initial docket record suffix', () => {
      const caseToVerify = new Case({});
      expect(caseToVerify.initialDocketNumberSuffix).toEqual('_');
    });

    it('should not add a docket record item when the suffix updates from the initial suffix when the case is new', () => {
      const caseToVerify = new Case({
        docketNumber: 'Bob',
        initialDocketNumberSuffix: 'W',
        status: 'New',
      });
      expect(caseToVerify.docketRecord.length).toEqual(0);
    });

    it('should add a docket record item when the suffix is different from the initial suffix and the case is not new', () => {
      const caseToVerify = new Case({
        docketNumber: 'Bob',
        initialDocketNumberSuffix: 'W',
        status: 'Recalled',
      });
      expect(caseToVerify.docketRecord[0].description).toEqual(
        "Docket Number is amended from 'BobW' to 'Bob'",
      );
    });

    it('should remove a docket record entry when the suffix updates back to the initial suffix', () => {
      const caseToVerify = new Case({
        docketNumber: 'Bob',
        docketRecord: [
          {
            description: 'Petition',
          },
          {
            description: "Docket Number is amended from 'Bob' to 'BobW'",
          },
        ],
        initialDocketNumberSuffix: '_',
        status: 'Recalled',
      });
      expect(caseToVerify.docketRecord.length).toEqual(1);
    });

    it('should not update a docket record entry when the suffix was changed earlier', () => {
      const caseToVerify = new Case({
        docketNumber: 'Bob',
        docketRecord: [
          {
            description: "Docket Number is amended from 'BobW' to 'Bob'",
          },
          {
            description: 'Petition',
          },
        ],
        initialDocketNumberSuffix: 'W',
        status: 'Recalled',
      });
      expect(caseToVerify.docketRecord.length).toEqual(2);
      expect(caseToVerify.docketRecord[0].description).toEqual(
        "Docket Number is amended from 'BobW' to 'Bob'",
      );
    });
  });

  describe('updateCaseTitleDocketRecord', () => {
    it('should not add to the docket record when the caption is not set', () => {
      const caseToVerify = new Case({}).updateCaseTitleDocketRecord();
      expect(caseToVerify.docketRecord.length).toEqual(0);
    });

    it('should not add to the docket record when the caption is initially being set', () => {
      const caseToVerify = new Case({
        caseCaption: 'Caption',
      }).updateCaseTitleDocketRecord();
      expect(caseToVerify.docketRecord.length).toEqual(0);
    });

    it('should not add to the docket record when the caption is equivalent to the initial title', () => {
      const caseToVerify = new Case({
        caseCaption: 'Caption',
        initialTitle: 'Caption v. Commissioner of Internal Revenue, Respondent',
      }).updateCaseTitleDocketRecord();
      expect(caseToVerify.docketRecord.length).toEqual(0);
    });

    it('should add to the docket record when the caption changes from the initial title', () => {
      const caseToVerify = new Case({
        caseCaption: 'A New Caption',
        initialTitle: 'Caption v. Commissioner of Internal Revenue, Respondent',
      }).updateCaseTitleDocketRecord();
      expect(caseToVerify.docketRecord.length).toEqual(1);
    });

    it('should not add to the docket record when the caption is equivalent to the last updated title', () => {
      const caseToVerify = new Case({
        caseCaption: 'A Very New Caption',
        docketRecord: [
          {
            description:
              "Caption of case is amended from 'Caption v. Commissioner of Internal Revenue, Respondent' to 'A New Caption v. Commissioner of Internal Revenue, Respondent'",
          },
          {
            description:
              "Caption of case is amended from 'A New Caption v. Commissioner of Internal Revenue, Respondent' to 'A Very New Caption v. Commissioner of Internal Revenue, Respondent'",
          },
        ],
        initialTitle: 'Caption v. Commissioner of Internal Revenue, Respondent',
      }).updateCaseTitleDocketRecord();
      expect(caseToVerify.docketRecord.length).toEqual(2);
    });

    it('should add to the docket record when the caption changes from the last updated title', () => {
      const caseToVerify = new Case({
        caseCaption: 'A Very Berry New Caption',
        docketRecord: [
          {
            description:
              "Caption of case is amended from 'Caption v. Commissioner of Internal Revenue, Respondent' to 'A New Caption v. Commissioner of Internal Revenue, Respondent'",
          },
          {
            description:
              "Caption of case is amended from 'A New Caption v. Commissioner of Internal Revenue, Respondent' to 'A Very New Caption v. Commissioner of Internal Revenue, Respondent'",
          },
        ],
        initialTitle: 'Caption v. Commissioner of Internal Revenue, Respondent',
      }).updateCaseTitleDocketRecord();
      expect(caseToVerify.docketRecord.length).toEqual(3);
    });
  });

  describe('getWorkItems', () => {
    it('should get all the work items associated with the documents in the case', () => {
      const myCase = new Case(MOCK_CASE);
      myCase.addDocument({
        documentId: '123',
        documentType: 'Answer',
        userId: 'respondent',
      });
      const workItem = new WorkItem({
        assigneeId: 'bob',
        assigneeName: 'bob',
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        caseStatus: 'new',
        caseTitle: 'testing',
        docketNumber: '101-18',
        document: {},
        sentBy: 'bob',
      });
      myCase.documents[0].addWorkItem(workItem);
      const workItems = myCase.getWorkItems();
      expect(workItems.length).toEqual(1);
      expect(workItems).toMatchObject([
        {
          assigneeId: 'bob',
          assigneeName: 'bob',
          caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          caseStatus: 'new',
          caseTitle: 'testing',
          docketNumber: '101-18',
          document: {},
          sentBy: 'bob',
        },
      ]);
    });
  });

  describe('checkForReadyForTrial', () => {
    it('should not change the status if no answer documents have been filed', () => {
      const caseToCheck = new Case({
        documents: [],
        status: STATUS_TYPES.generalDocket,
      }).checkForReadyForTrial();
      expect(caseToCheck.status).toEqual(STATUS_TYPES.generalDocket);
    });

    it('should not change the status if an answer document has been filed, but the cutoff has not elapsed', () => {
      const caseToCheck = new Case({
        documents: [
          {
            createdAt: moment().toISOString(),
            eventCode: 'A',
          },
        ],
        status: STATUS_TYPES.generalDocket,
      }).checkForReadyForTrial();
      expect(caseToCheck.status).toEqual(STATUS_TYPES.generalDocket);
    });

    it('should not change the status if a non answer document has been filed before the cutoff', () => {
      const caseToCheck = new Case({
        documents: [
          {
            createdAt: moment()
              .subtract(1, 'year')
              .toISOString(),
            eventCode: 'ZZZs',
          },
        ],
        status: STATUS_TYPES.generalDocket,
      }).checkForReadyForTrial();
      expect(caseToCheck.status).toEqual(STATUS_TYPES.generalDocket);
    });

    it("should not change the status to 'Ready for Trial' when an answer document has been filed on the cutoff", () => {
      const caseToCheck = new Case({
        documents: [
          {
            createdAt: moment()
              .subtract(ANSWER_CUTOFF_AMOUNT, ANSWER_CUTOFF_UNIT)
              .toISOString(),
            eventCode: 'A',
          },
        ],
        status: STATUS_TYPES.generalDocket,
      }).checkForReadyForTrial();

      expect(caseToCheck.status).not.toEqual(
        STATUS_TYPES.generalDocketReadyForTrial,
      );
    });

    it("should not change the status to 'Ready for Trial' when an answer document has been filed before the cutoff but case is not 'Not at issue'", () => {
      const createdAt = moment()
        .subtract(ANSWER_CUTOFF_AMOUNT + 10, ANSWER_CUTOFF_UNIT)
        .toISOString();

      const caseToCheck = new Case({
        documents: [
          {
            createdAt,
            eventCode: 'A',
          },
        ],
        status: STATUS_TYPES.new,
      }).checkForReadyForTrial();

      expect(caseToCheck.status).toEqual(STATUS_TYPES.new);
    });

    it("should change the status to 'Ready for Trial' when an answer document has been filed before the cutoff", () => {
      const createdAt = moment()
        .subtract(ANSWER_CUTOFF_AMOUNT + 10, ANSWER_CUTOFF_UNIT)
        .toISOString();

      const caseToCheck = new Case({
        documents: [
          {
            createdAt,
            eventCode: 'A',
          },
        ],
        status: STATUS_TYPES.generalDocket,
      }).checkForReadyForTrial();

      expect(caseToCheck.status).toEqual(
        STATUS_TYPES.generalDocketReadyForTrial,
      );
    });
  });

  describe('generateTrialSortTags', () => {
    it('should generate sort tags for a regular case', () => {
      const myCase = new Case({
        ...MOCK_CASE,
        createdAt: new Date('12-12-2018').toISOString(),
      });
      expect(myCase.generateTrialSortTags()).toEqual({
        hybrid:
          'WashingtonDC-H-B-20181212010000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
        nonHybrid:
          'WashingtonDC-R-B-20181212010000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    });

    it('should generate sort tags for a small case', () => {
      const myCase = new Case({
        ...MOCK_CASE,
        createdAt: new Date('12-12-2018').toISOString(),
        procedureType: 'Small',
      });
      expect(myCase.generateTrialSortTags()).toEqual({
        hybrid:
          'WashingtonDC-H-B-20181212010000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
        nonHybrid:
          'WashingtonDC-S-B-20181212010000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    });

    it('should generate sort tags for a prioritized case', () => {
      const myCase = new Case({
        ...MOCK_CASE,
        createdAt: new Date('12-12-2018').toISOString(),
        caseType: 'passport',
      });
      expect(myCase.generateTrialSortTags()).toEqual({
        hybrid:
          'WashingtonDC-H-A-20181212010000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
        nonHybrid:
          'WashingtonDC-R-A-20181212010000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    });
  });
});
