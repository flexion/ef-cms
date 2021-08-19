const {
  A_VALID_DOCKET_ENTRY,
  MOCK_PETITIONERS,
  mockPrimaryId,
  mockSecondaryId,
} = require('./DocketEntry.test');
const {
  EVENT_CODES_REQUIRING_SIGNATURE,
  EXTERNAL_DOCUMENT_TYPES,
  INTERNAL_DOCUMENT_TYPES,
  OPINION_DOCUMENT_TYPES,
  ORDER_TYPES,
  TRANSCRIPT_EVENT_CODE,
} = require('./EntityConstants');
const { applicationContext } = require('../test/createTestApplicationContext');
const { DocketEntry } = require('./DocketEntry');

describe('validate', () => {
  const mockUserId = applicationContext.getUniqueId();

  const validTests = [
    {
      description: 'should do nothing if valid',
      docketEntry: {
        documentContents: 'this is the content of the document',
      },
    },
    {
      description:
        'should not throw an error on valid court-issued docket entry with null filedBy string',
      docketEntry: {
        documentTitle: 'Order',
        documentType: 'Order',
        eventCode: 'O',
        filedBy: null,
        signedAt: 'Not in Blackstone',
        signedByUserId: 'a11077ed-c01d-4add-ab1e-da7aba5eda7a',
        signedJudgeName: 'Mock Signed Judge',
      },
    },
    {
      description:
        'should not throw an error on valid court-issued docket entry with empty filedBy string',
      docketEntry: {
        documentTitle: 'Order',
        documentType: 'Order',
        eventCode: 'O',
        filedBy: '',
        signedAt: 'Not in Blackstone',
        signedByUserId: 'a11077ed-c01d-4add-ab1e-da7aba5eda7a',
        signedJudgeName: 'Mock Signed Judge',
      },
    },
    {
      description:
        'should pass validation when "isLegacy" is true, "isLegacySealed" is true, "isSealed" is true',
      docketEntry: {
        documentType: ORDER_TYPES[0].documentType,
        eventCode: 'O',
        isLegacy: true,
        isLegacySealed: true,
        isSealed: true,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: 'cb42b552-c112-49f4-b7ef-2b0e20ca8e57',
        signedJudgeName: 'A Judge',
      },
    },
    {
      description:
        'should pass validation when "isLegacySealed" is false, "isSealed" and "isLegacy" are undefined',
      docketEntry: {
        documentType: ORDER_TYPES[0].documentType,
        eventCode: 'O',
        isLegacySealed: false,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: 'cb42b552-c112-49f4-b7ef-2b0e20ca8e57',
        signedJudgeName: 'A Judge',
      },
    },
    {
      description:
        'should pass validation when filedBy is undefined and documentType is not in the list of documents that require filedBy',
      docketEntry: { ...A_VALID_DOCKET_ENTRY, documentType: 'Petition' },
    },
    {
      description:
        'should pass validation when "filedBy" is provided and documentType is in the list of documents that require filedBy',
      docketEntry: {
        documentType: EXTERNAL_DOCUMENT_TYPES[0],
        eventCode: TRANSCRIPT_EVENT_CODE,
        filedBy: 'Test Petitioner1',
      },
    },
    {
      description:
        'should pass validation when "isAutoGenerated" is true and "filedBy" is undefined for autogenerated docket entry',
      docketEntry: {
        documentType: 'Notice of Change of Address',
        eventCode: 'NCA',
        filedBy: undefined,
        filers: [],
        isAutoGenerated: true,
      },
    },
    {
      description:
        'should pass validation when "isAutoGenerated" is undefined and "filedBy" is undefined',
      docketEntry: {
        documentType: 'Notice of Change of Address',
        eventCode: 'NCA',
        filedBy: undefined,
        filers: [],
      },
    },
    {
      description:
        'should pass validation when "filedBy" is provided for internal filing event that is not auto generated',
      docketEntry: {
        documentType: INTERNAL_DOCUMENT_TYPES[0],
        eventCode: TRANSCRIPT_EVENT_CODE,
        filedBy: 'Test Petitioner1',
        filers: [],
      },
    },
    {
      description:
        'should pass validation when "isAutoGenerated" is true and "filedBy" is undefined for internal filing event',
      docketEntry: {
        documentType: 'Notice of Change of Address',
        eventCode: 'NCA',
        filedBy: undefined,
        filers: [],
        isAutoGenerated: true,
      },
    },
    {
      description:
        'should pass validation when "isAutoGenerated" is undefined and "filedBy" is undefined for internal filing event',
      docketEntry: {
        documentType: 'Notice of Change of Address',
        eventCode: 'NCA',
        filedBy: undefined,
        filers: [],
      },
    },
    {
      description:
        'should pass validation when isDraft is false and signedAt is undefined for a document not requiring signature',
      docketEntry: {
        documentType: 'Answer',
        eventCode: 'A',
        isDraft: false,
        signedAt: undefined,
        signedJudgeName: undefined,
      },
    },
    {
      description:
        'should pass validation when isDraft is false and signedJudgeName is undefined for a document not requiring signature',
      docketEntry: {
        documentType: 'Answer',
        eventCode: 'A',
        isDraft: false,
        signedAt: undefined,
        signedJudgeName: undefined,
      },
    },
    {
      description:
        'should pass validation when isDraft is false and signedJudgeName and signedAt are defined for a document requiring signature',
      docketEntry: {
        documentType: 'Order',
        eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
        isDraft: false,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
    },
    {
      description:
        'should pass validation when isDraft is true and signedJudgeName and signedAt are undefined',
      docketEntry: {
        documentType: 'Order',
        eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
        isDraft: true,
        signedAt: undefined,
        signedJudgeName: undefined,
      },
    },
    {
      description:
        'should pass validation when the document type is Order and a "signedAt" is provided',
      docketEntry: {
        documentType: 'Order',
        eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
    },
    {
      description:
        'should pass validation when the document type is Order and "signedJudgeName" and "signedByUserId" are provided',
      docketEntry: {
        documentType: 'Order',
        eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
    },
  ];

  validTests.forEach(validTest =>
    it(`${validTest.description}`, () => {
      const docketEntry = new DocketEntry(
        { ...A_VALID_DOCKET_ENTRY, ...validTest.docketEntry },
        {
          applicationContext,
          petitioners: MOCK_PETITIONERS,
        },
      ).validate();

      expect(docketEntry.isValid()).toBeTruthy();
    }),
  );

  const invalidTests = [
    {
      description:
        'should be invalid if filedBy is undefined, filers is valid, and servedAt is populated',
      docketEntry: {
        filedBy: undefined,
        filers: [mockPrimaryId, mockSecondaryId],
        isLegacyServed: undefined,
        servedAt: '2019-08-25T05:00:00.000Z',
        servedParties: [{ name: 'Test Petitioner' }],
      },
      expectValidationErrors: ['filedBy'],
    },
    {
      description:
        'should fail validation when "isLegacySealed" is true but "isLegacy" and "isSealed" are undefined',
      docketEntry: { isLegacySealed: true },
      expectValidationErrors: ['isLegacy', 'isSealed'],
    },
    {
      description:
        'should fail validation when "filedBy" is not provided and documentType is in the list of documents that require filedBy',
      docketEntry: {
        documentType: EXTERNAL_DOCUMENT_TYPES[0],
        eventCode: TRANSCRIPT_EVENT_CODE,
        filedBy: undefined,
        filers: [],
      },
    },
    {
      description:
        'should fail validation when "isAutoGenerated" is false and "filedBy" is undefined for external document',
      docketEntry: {
        documentType: 'Notice of Change of Address',
        eventCode: 'NCA',
        filedBy: undefined,
        filers: [],
        isAutoGenerated: false,
      },
    },
    {
      description: '',
      docketEntry: {},
      expectValidationErrors: ['filedBy'],
    },
    {
      description: '',
      docketEntry: {},
      expectValidationErrors: ['filedBy'],
    },
    {
      description: '',
      docketEntry: {},
      expectValidationErrors: ['filedBy'],
    },
  ];

  invalidTests.forEach(invalidTest =>
    it(`${invalidTest.description}`, () => {
      const docketEntry = new DocketEntry(
        { ...A_VALID_DOCKET_ENTRY, ...invalidTest.docketEntry },
        {
          applicationContext,
          petitioners: MOCK_PETITIONERS,
        },
      ).validate();

      expect(docketEntry.isValid()).toBeFalsy();

      if (invalidTests.expectValidationErrors) {
        expect(Object.keys(docketEntry.getFormattedValidationErrors())).toEqual(
          invalidTests.expectValidationErrors,
        );
      }
    }),
  );

  it('should throw an error on invalid docket entries', () => {
    expect(() => {
      new DocketEntry({}, { applicationContext }).validate();
    }).toThrow('The DocketEntry entity was invalid');
  });

  describe('filedBy scenarios', () => {
    describe('documentType is in the list of documents that require filedBy', () => {
      describe('internal filing events', () => {
        describe('that are not autogenerated', () => {
          it('should fail validation when "filedBy" is not provided', () => {
            const docketEntry = new DocketEntry(
              {
                ...A_VALID_DOCKET_ENTRY,
                documentType: INTERNAL_DOCUMENT_TYPES[0],
                eventCode: TRANSCRIPT_EVENT_CODE,
                filedBy: undefined,
                filers: [],
              },
              { applicationContext, petitioners: MOCK_PETITIONERS },
            );
            expect(docketEntry.isValid()).toBeFalsy();
            expect(docketEntry.filedBy).toBeUndefined();
          });
        });

        describe('that are autogenerated', () => {
          it('should fail validation when "isAutoGenerated" is false and "filedBy" is undefined', () => {
            const docketEntry = new DocketEntry(
              {
                ...A_VALID_DOCKET_ENTRY,
                documentType: 'Notice of Change of Address',
                eventCode: 'NCA',
                filedBy: undefined,
                filers: [],
                isAutoGenerated: false,
              },
              { applicationContext, petitioners: MOCK_PETITIONERS },
            );

            expect(docketEntry.isValid()).toBeFalsy();
          });
        });
      });
    });
  });

  describe('signed property scenarios', () => {
    it('should fail validation when isDraft is false and signedAt is undefined for a document requiring signature', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: 'Order',
          eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
          isDraft: false,
          signedAt: undefined,
          signedJudgeName: undefined,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(docketEntry.isValid()).toBeFalsy();
    });

    it('should fail validation when isDraft is false and signedJudgeName is undefined for a document requiring signature', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: 'Order',
          eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
          isDraft: false,
          signedAt: undefined,
          signedJudgeName: undefined,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(docketEntry.isValid()).toBeFalsy();
    });

    it('should fail validation when the document type is Order and "signedJudgeName" is not provided', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: 'Order',
          eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(docketEntry.isValid()).toBeFalsy();
    });

    it('should fail validation when the document type is Order but no "signedAt" is provided', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: 'Order',
          eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(docketEntry.isValid()).toBeFalsy();
    });
  });

  it('should fail validation when the document type is opinion and judge is not provided', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentType: OPINION_DOCUMENT_TYPES[0].documentType,
        eventCode: 'MOP',
      },
      { applicationContext, petitioners: MOCK_PETITIONERS },
    );
    expect(docketEntry.isValid()).toBeFalsy();
    expect(docketEntry.judge).toBeUndefined();
  });

  it('should fail validation when the document has a servedAt date and servedParties is not defined', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentType: ORDER_TYPES[0].documentType,
        eventCode: TRANSCRIPT_EVENT_CODE,
        servedAt: '2019-03-01T21:40:46.415Z',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      { applicationContext, petitioners: MOCK_PETITIONERS },
    );

    expect(docketEntry.isValid()).toBeFalsy();
    expect(docketEntry.getFormattedValidationErrors()).toMatchObject({
      servedParties: '"servedParties" is required',
    });
  });

  it('should fail validation when the document has servedParties and servedAt is not defined', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentType: ORDER_TYPES[0].documentType,
        eventCode: TRANSCRIPT_EVENT_CODE,
        servedParties: 'Test Petitioner',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      { applicationContext, petitioners: MOCK_PETITIONERS },
    );

    expect(docketEntry.isValid()).toBeFalsy();
    expect(docketEntry.getFormattedValidationErrors()).toMatchObject({
      servedAt: '"servedAt" is required',
    });
  });
});
