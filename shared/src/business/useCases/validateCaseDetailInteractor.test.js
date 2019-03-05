const { validateCaseDetail } = require('./validateCaseDetailInteractor');

describe('validate case detail', () => {
  it('returns the expected errors object on an empty case', () => {
    const errors = validateCaseDetail({
      caseDetail: {},
    });
    expect(errors).toBeTruthy();
    expect(errors).toMatchObject({
      docketNumber: 'Docket number is required.',
    });
  });

  it('does not return an error if that field is valid', () => {
    const errors = validateCaseDetail({
      caseDetail: {
        caseTitle: 'A case title',
      },
    });
    expect(errors).toBeTruthy();
    expect(errors).toMatchObject({
      docketNumber: 'Docket number is required.',
    });
  });

  it('returns no errors if the case validates', () => {
    const errors = validateCaseDetail({
      caseDetail: {
        caseType: 'defined',
        docketNumber: '101-18',
        documents: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            reviewDate: '2018-11-21T20:49:28.192Z',
            reviewUser: 'petitionsclerk',
            role: 'petitioner',
            userId: 'taxpayer',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            reviewDate: '2018-11-21T20:49:28.192Z',
            reviewUser: 'petitionsclerk',
            role: 'petitioner',
            userId: 'taxpayer',
            workItems: [],
          },
        ],
        filingType: 'Myself',
        hasIrsNotice: true,
        irsNoticeDate: new Date().toISOString(),
        partyType: 'Petitioner',
        petitioners: [{ name: 'user' }],
        preferredTrialCity: 'defined',
        procedureType: 'defined',
        signature: true,
      },
    });
    expect(errors).toEqual(null);
  });

  it('returns the expected errors when passed bad date objects', () => {
    const errors = validateCaseDetail({
      caseDetail: {
        hasIrsNotice: true,
        irsNoticeDate: 'aa',
        payGovDate: '12',
      },
    });
    expect(errors).toBeTruthy();
    expect(errors.irsNoticeDate).toBeTruthy();
    expect(errors.payGovDate).toBeTruthy();
  });

  xit('returns an error if yearAmounts is missing a required value', () => {
    const errors = validateCaseDetail({
      caseDetail: {
        caseType: 'defined',
        docketNumber: '101-18',
        documents: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            reviewDate: '2018-11-21T20:49:28.192Z',
            reviewUser: 'petitionsclerk',
            role: 'petitioner',
            userId: 'taxpayer',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            reviewDate: '2018-11-21T20:49:28.192Z',
            reviewUser: 'petitionsclerk',
            role: 'petitioner',
            userId: 'taxpayer',
            workItems: [],
          },
        ],
        filingType: 'defined',
        hasIrsNotice: true,
        irsNoticeDate: new Date().toISOString(),
        petitioners: [{ name: 'user' }],
        procedureType: 'defined',
        signature: true,
        yearAmounts: [
          {
            amount: '123',
          },
          {
            year: '1236-01-01',
          },
          {
            amount: '1000',
            year: '1234-01-01',
          },
          {
            amount: '1000',
            year: '2100-01-01',
          },
          {
            amount: '123',
            year: '2200-01-01',
          },
        ],
      },
    });
    expect(errors.preferredTrialCity).toEqual(
      'Preferred Trial City is required.',
    );

    const yearAmount0 = errors.yearAmounts.find(
      yearAmount => yearAmount.index === 0,
    );

    const yearAmount3 = errors.yearAmounts.find(
      yearAmount => yearAmount.index === 3,
    );

    const yearAmount4 = errors.yearAmounts.find(
      yearAmount => yearAmount.index === 4,
    );
    expect(yearAmount0.year).toEqual('Please enter a valid year.');
    expect(yearAmount0.amount).toBeUndefined();
    expect(yearAmount3.year).toEqual(
      'That year is in the future. Please enter a valid year.',
    );
    expect(yearAmount4.year).toEqual(
      'That year is in the future. Please enter a valid year.',
    );
    expect(yearAmount4.index).toEqual(4);
  });

  it('returns an error if yearAmounts have duplicate years', () => {
    const errors = validateCaseDetail({
      caseDetail: {
        caseType: 'defined',
        docketNumber: '101-18',
        documents: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            reviewDate: '2018-11-21T20:49:28.192Z',
            reviewUser: 'petitionsclerk',
            role: 'petitioner',
            userId: 'taxpayer',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            reviewDate: '2018-11-21T20:49:28.192Z',
            reviewUser: 'petitionsclerk',
            role: 'petitioner',
            userId: 'taxpayer',
            workItems: [],
          },
        ],
        filingType: 'defined',
        hasIrsNotice: true,
        irsNoticeDate: new Date().toISOString(),
        partyType: 'Petitioner',
        petitioners: [{ name: 'user' }],
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'defined',
        signature: true,
        yearAmounts: [
          {
            amount: '123',
            year: '2000',
          },
          {
            amount: '99',
            year: '2000',
          },
        ],
      },
    });
    expect(errors).toEqual({
      yearAmounts: 'Duplicate years are not allowed',
    });
  });

  it('returns an error if yearAmounts is in the future', () => {
    const errors = validateCaseDetail({
      caseDetail: {
        caseType: 'defined',
        docketNumber: '101-18',
        documents: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            reviewDate: '2018-11-21T20:49:28.192Z',
            reviewUser: 'petitionsclerk',
            role: 'petitioner',
            userId: 'taxpayer',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            reviewDate: '2018-11-21T20:49:28.192Z',
            reviewUser: 'petitionsclerk',
            role: 'petitioner',
            userId: 'taxpayer',
            workItems: [],
          },
        ],
        filingType: 'defined',
        hasIrsNotice: true,
        irsNoticeDate: new Date().toISOString(),
        partyType: 'Petitioner',
        petitioners: [{ name: 'user' }],
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'defined',
        signature: true,
        yearAmounts: [
          {
            amount: 0,
            year: '2100-01-01',
          },
        ],
      },
    });
    expect(errors).toEqual({
      yearAmounts: [
        {
          amount: 'Please enter a valid amount.',
          index: 0,
          year: 'That year is in the future. Please enter a valid year.',
        },
      ],
    });
  });

  it('returns no errors on valid amounts and years', () => {
    const errors = validateCaseDetail({
      caseDetail: {
        caseType: 'defined',
        docketNumber: '101-18',
        documents: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            reviewDate: '2018-11-21T20:49:28.192Z',
            reviewUser: 'petitionsclerk',
            role: 'petitioner',
            userId: 'taxpayer',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            reviewDate: '2018-11-21T20:49:28.192Z',
            reviewUser: 'petitionsclerk',
            role: 'petitioner',
            userId: 'taxpayer',
            workItems: [],
          },
        ],
        filingType: 'defined',
        hasIrsNotice: true,
        irsNoticeDate: new Date().toISOString(),
        partyType: 'Petitioner',
        petitioners: [{ name: 'user' }],
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'defined',
        signature: true,
        yearAmounts: [
          {
            amount: '123',
            year: '2000',
          },
          {
            amount: 123,
            year: '2001',
          },
          {
            amount: '1',
            year: '2002',
          },
        ],
      },
    });
    expect(errors).toEqual(null);
  });

  it('returns no errors on null irsNoticeDate', () => {
    const errors = validateCaseDetail({
      caseDetail: {
        caseType: 'defined',
        docketNumber: '101-18',
        documents: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            reviewDate: '2018-11-21T20:49:28.192Z',
            reviewUser: 'petitionsclerk',
            role: 'petitioner',
            userId: 'taxpayer',
            workItems: [],
          },
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
            documentType: 'Petition',
            reviewDate: '2018-11-21T20:49:28.192Z',
            reviewUser: 'petitionsclerk',
            role: 'petitioner',
            userId: 'taxpayer',
            workItems: [],
          },
        ],
        filingType: 'defined',
        hasIrsNotice: false,
        irsNoticeDate: null,
        partyType: 'Petitioner',
        payGovDate: '2018-12-24T00:00:00.000Z',
        petitioners: [{ name: 'user' }],
        preferredTrialCity: 'Chattanooga, TN',
        procedureType: 'defined',
        signature: true,
        yearAmounts: [],
      },
    });
    expect(errors).toEqual(null);
  });
});
