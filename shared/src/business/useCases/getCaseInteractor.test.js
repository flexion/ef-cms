const {
  CASE_TYPES_MAP,
  PARTY_TYPES,
  ROLES,
} = require('../entities/EntityConstants');
const {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} = require('../../test/mockCase');
const { applicationContext } = require('../test/createTestApplicationContext');
const { getCaseInteractor } = require('./getCaseInteractor');
const { docketEntries } = MOCK_CASE;
const { cloneDeep } = require('lodash');

const petitionsclerkId = '23c4d382-1136-492f-b1f4-45e893c34771';
const docketClerkId = '44c4d382-1136-492f-b1f4-45e893c34771';
const petitionerId = '273f5d19-3707-41c0-bccc-449c52dfe54e';
const irsPractitionerId = '6cf19fba-18c6-467a-9ea6-7a14e42add2f';
const practitionerId = '295c3640-7ff9-40bb-b2f1-8117bba084ea';
const practitioner2Id = '42614976-4228-49aa-a4c3-597dae1c7220';

describe('Get case', () => {
  it('successfully retrieves a case with docketEntries that have documentContents', async () => {
    const mockCaseWithDocumentContents = {
      ...MOCK_CASE,
      docketEntries: [
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketEntryId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          docketNumber: '101-18',
          documentContentsId: '0098d177-78ef-4210-88aa-4bbb45c4f048',
          documentTitle: 'Petition',
          documentType: 'Petition',
          draftOrderState: {},
          eventCode: 'P',
          filedBy: 'Test Petitioner',
          processingStatus: 'pending',
          userId: petitionerId,
        },
      ],
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: petitionsclerkId,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCaseWithDocumentContents);
    applicationContext.getPersistenceGateway().getDocument.mockReturnValue(
      Buffer.from(
        JSON.stringify({
          documentContents: 'the contents!',
          richText: '<b>the contents!</b>',
        }),
      ),
    );

    const caseRecord = await getCaseInteractor({
      applicationContext,
      docketNumber: '123-19',
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).toHaveBeenCalledWith({
      applicationContext,
      key: '0098d177-78ef-4210-88aa-4bbb45c4f048',
      protocol: 'S3',
      useTempBucket: false,
    });
    expect(caseRecord.docketEntries[0]).toMatchObject({
      documentContents: 'the contents!',
      draftOrderState: {
        documentContents: 'the contents!',
        richText: '<b>the contents!</b>',
      },
    });
  });

  it('failure case by case id', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Tasha Yar',
      role: ROLES.petitionsClerk,
      userId: petitionsclerkId,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(Promise.resolve(null));

    await expect(
      getCaseInteractor({
        applicationContext,
        docketNumber: '123-19',
      }),
    ).rejects.toThrow('Case 123-19 was not found.');
  });

  it('success case by docket number', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: petitionsclerkId,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);

    await getCaseInteractor({
      applicationContext,
      docketNumber: '101-00',
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0].docketNumber,
    ).toEqual('101-00');
  });

  it('failure case by docket number', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(undefined);
    await expect(
      getCaseInteractor({
        applicationContext,
        docketNumber: '00-11111',
      }),
    ).rejects.toThrow('Case 00-11111 was not found.');
  });

  it('failure case by invalid user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: 'someone',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          caseType: CASE_TYPES_MAP.other,
          contactPrimary: {},
          createdAt: new Date().toISOString(),
          docketEntries,
          docketNumber: '101-00',
          preferredTrialCity: 'Washington, District of Columbia',
          procedureType: 'Regular',
        }),
      );

    await expect(
      getCaseInteractor({
        applicationContext,
        docketNumber: '00101-00',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should successfully return a case with userId not matching the current user but contactPrimary.contactId matching the current user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: 'dc56e26e-f9fd-4165-8997-97676cc0523e',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          contactPrimary: {
            ...MOCK_CASE.contactPrimary,
            contactId: 'dc56e26e-f9fd-4165-8997-97676cc0523e',
          },
          docketNumber: '101-00',
          userId: '320fce0e-b050-4e04-8720-db25da3ca598',
        }),
      );

    const result = await getCaseInteractor({
      applicationContext,
      docketNumber: '00101-00',
    });

    expect(result.docketNumber).toEqual('101-00');
  });

  it('should successfully return a case with userId not matching the current user but contactSecondary.contactId matching the current user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: '754a3191-884f-42f0-ad2c-e6c706685299',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          contactPrimary: {
            ...MOCK_CASE.contactPrimary,
            contactId: '0898d5c3-2948-4924-b28b-d5c1451c80de',
          },
          contactSecondary: {
            ...MOCK_CASE.contactPrimary,
            contactId: '754a3191-884f-42f0-ad2c-e6c706685299',
          },
          docketNumber: '101-00',
          partyType: PARTY_TYPES.petitionerSpouse,
          userId: '320fce0e-b050-4e04-8720-db25da3ca598',
        }),
      );

    const result = await getCaseInteractor({
      applicationContext,
      docketNumber: '00101-00',
    });

    expect(result.docketNumber).toEqual('101-00');
  });

  describe('access to contact information which is sealed', () => {
    beforeAll(() => {
      const mockCaseWithSealed = cloneDeep(MOCK_CASE_WITH_SECONDARY_OTHERS);
      // seal ALL addresses present on this mock case
      mockCaseWithSealed.contactPrimary.isAddressSealed = true;
      mockCaseWithSealed.contactSecondary.isAddressSealed = true;
      mockCaseWithSealed.otherFilers.forEach(
        filer => (filer.isAddressSealed = true),
      );
      mockCaseWithSealed.otherPetitioners.forEach(
        filer => (filer.isAddressSealed = true),
      );
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCaseWithSealed);
    });

    it(`allows unfiltered view of sealed contact addresses if role is ${ROLES.docket_clerk}`, async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        name: 'Security Officer Worf',
        role: ROLES.docketClerk,
        userId: docketClerkId,
      });
      const result = await getCaseInteractor({
        applicationContext,
        docketNumber: '101-18',
      });
      expect(result.contactPrimary.city).toBeDefined();
      expect(result.contactPrimary.sealedAndUnavailable).toBe(false);
      expect(result.contactSecondary.city).toBeDefined();
      expect(result.contactSecondary.sealedAndUnavailable).toBe(false);
      result.otherFilers.forEach(filer => {
        expect(filer.city).toBeDefined();
        expect(filer.sealedAndUnavailable).toBe(false);
      });
      result.otherPetitioners.forEach(filer => {
        expect(filer.city).toBeDefined();
        expect(filer.sealedAndUnavailable).toBe(false);
      });
    });

    it('returns limited contact address information when address is sealed and requesting user is not docket clerk', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        name: 'Reginald Barclay',
        role: ROLES.privatePractitioner,
        userId: applicationContext.getUniqueId(),
      });

      const result = await getCaseInteractor({
        applicationContext,
        docketNumber: '101-18',
      });

      expect(result.contactPrimary.city).toBeUndefined();
      // expect(result.contactPrimary.sealedAndUnavailable).toBe(true);
      expect(result.contactSecondary.city).toBeUndefined();
      // expect(result.contactSecondary.sealedAndUnavailable).toBe(true);
      // result.otherFilers.forEach(filer => {
      //   expect(filer.city).toBeUndefined();
      //   expect(filer.sealedAndUnavailable).toBe(true);
      // });
      // result.otherPetitioners.forEach(filer => {
      //   expect(filer.city).toBeUndefined();
      //   expect(filer.sealedAndUnavailable).toBe(true);
      // });
    });
  });

  describe('permissions-filtered access', () => {
    beforeAll(() => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(
          Promise.resolve({
            ...MOCK_CASE,
            caseCaption: 'a case caption',
            caseType: CASE_TYPES_MAP.other,
            createdAt: new Date().toISOString(),
            docketEntries,
            docketNumber: '101-18',
            irsPractitioners: [
              {
                barNumber: 'BN1234',
                name: 'Wesley Crusher',
                role: ROLES.irsPractitioner,
                userId: irsPractitionerId,
              },
            ],
            preferredTrialCity: 'Washington, District of Columbia',
            privatePractitioners: [
              {
                barNumber: 'BN1234',
                name: 'Katherine Pulaski',
                role: ROLES.privatePractitioner,
                userId: practitionerId,
              },
            ],
            procedureType: 'Regular',
            sealedDate: new Date().toISOString(),
          }),
        );
    });

    it('restricted case by inadequate permissions', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        barNumber: 'BN1234',
        name: 'Beverly Crusher',
        role: ROLES.privatePractitioner,
        userId: 'practitioner2',
      });

      let error, result;
      try {
        result = await getCaseInteractor({
          applicationContext,
          docketNumber: '101-18',
        });
      } catch (err) {
        error = err;
        console.log(err.stack);
      }

      expect(error).not.toBeDefined();
      expect(result).toMatchObject({ isSealed: true });
    });

    it('full case access via sealed case permissions', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        barNumber: 'BN1234',
        name: 'Saul Goodman',
        role: ROLES.docketClerk,
        userId: practitioner2Id,
      });

      let error, result;
      try {
        result = await getCaseInteractor({
          applicationContext,
          docketNumber: '00101-18',
        });
      } catch (err) {
        error = err;
        console.log(err.stack);
      }

      expect(error).not.toBeDefined();
      expect(result).toMatchObject({
        caseCaption: 'a case caption',
        sealedDate: expect.anything(),
      });
    });
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: petitionsclerkId,
    });
    const mockInvalidCase = { ...MOCK_CASE, caseCaption: undefined };
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockInvalidCase);

    await expect(
      getCaseInteractor({
        applicationContext,
        docketNumber: '00101-08',
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });
});
