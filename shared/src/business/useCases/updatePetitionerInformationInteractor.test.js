const {
  applicationContext,
  testPdfDoc,
} = require('../test/createTestApplicationContext');
const {
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} = require('../entities/EntityConstants');
const {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} = require('../../test/mockCase');
const {
  updatePetitionerInformationInteractor,
} = require('./updatePetitionerInformationInteractor');
const { PARTY_TYPES, ROLES } = require('../entities/EntityConstants');
const { User } = require('../entities/User');
jest.mock('./addCoversheetInteractor');
const { addCoverToPdf } = require('./addCoversheetInteractor');

describe('update petitioner contact information on a case', () => {
  let mockUser;
  let mockCase;

  const userData = {
    name: 'administrator',
    role: ROLES.docketClerk,
    userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  };

  const basePractitioner = {
    barNumber: 'PT1234',
    email: 'practitioner1@example.com',
    name: 'Test Practitioner',
    representingPrimary: true,
    role: ROLES.privatePractitioner,
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    userId: '898bbe4b-84ee-40a1-ad05-a1e2e8484c72',
  };
  beforeAll(() => {
    addCoverToPdf.mockResolvedValue({
      pdfData: testPdfDoc,
    });

    applicationContext.getCurrentUser.mockImplementation(
      () => new User(mockUser),
    );
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => mockCase);
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({
        url: 'https://www.example.com',
      });
  });

  beforeEach(() => {
    mockUser = userData;
    mockCase = MOCK_CASE;
  });

  it('updates case even if no change of address or phone is detected', async () => {
    await updatePetitionerInformationInteractor({
      applicationContext,
      contactPrimary: MOCK_CASE.contactPrimary,
      docketNumber: MOCK_CASE.docketNumber,
      partyType: PARTY_TYPES.petitioner,
    });

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('throws an error if contactSecondary is required for the party type and is not valid', async () => {
    await expect(
      updatePetitionerInformationInteractor({
        applicationContext,
        contactPrimary: MOCK_CASE.contactPrimary,
        contactSecondary: { countryType: COUNTRY_TYPES.DOMESTIC },
        docketNumber: MOCK_CASE.docketNumber,
        partyType: PARTY_TYPES.petitionerSpouse,
      }),
    ).rejects.toThrow();

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toHaveBeenCalled();
  });

  it('updates petitioner contact when primary contact info changes and serves the notice created', async () => {
    const mockNumberOfPages = 999;
    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockReturnValue(mockNumberOfPages);

    await updatePetitionerInformationInteractor({
      applicationContext,
      contactPrimary: {
        address1: '456 Center St', // the address changes ONLY
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'test@example.com',
        name: 'Test Petitioner',
        phone: '1234567',
        postalCode: '12345',
        state: 'TN',
        title: 'Executor',
      },
      docketNumber: MOCK_CASE.docketNumber,
      partyType: PARTY_TYPES.petitioner,
    });

    const autoGeneratedDocument = applicationContext
      .getPersistenceGateway()
      .updateCase.mock.calls[0][0].caseToUpdate.docketEntries.find(
        d => d.documentType === 'Notice of Change of Address',
      );
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).toHaveBeenCalled();
    expect(autoGeneratedDocument).toMatchObject({
      isAutoGenerated: true,
      isFileAttached: true,
      numberOfPages: mockNumberOfPages,
    });
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
  });

  it('updates petitioner contact when secondary contact info changes and does not generate or serve a notice if the secondary contact was not previously present', async () => {
    await updatePetitionerInformationInteractor({
      applicationContext,
      contactPrimary: MOCK_CASE.contactPrimary,
      contactSecondary: {
        address1: '789 Division St',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Test Petitioner',
        phone: '1234567',
        postalCode: '12345',
        state: 'TN',
        title: 'Executor',
      },
      docketNumber: MOCK_CASE.docketNumber,
      partyType: PARTY_TYPES.petitionerSpouse,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).not.toHaveBeenCalled();
  });

  it('updates petitioner contact when secondary contact info changes, serves the generated notice, and returns the download URL for the paper notice if the contactSecondary was previously on the case', async () => {
    mockCase = {
      ...MOCK_CASE,
      contactSecondary: {
        address1: '789 Division St',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Test Petitioner',
        phone: '1234567',
        postalCode: '12345',
        state: 'TN',
        title: 'Executor',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    };

    const result = await updatePetitionerInformationInteractor({
      applicationContext,
      contactPrimary: MOCK_CASE.contactPrimary,
      contactSecondary: {
        address1: '789 Division St APT 123', //changed address1
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Test Petitioner',
        phone: '1234567',
        postalCode: '12345',
        state: 'TN',
        title: 'Executor',
      },
      docketNumber: MOCK_CASE.docketNumber,
      partyType: PARTY_TYPES.petitionerSpouse,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
    expect(result.paperServicePdfUrl).toEqual('https://www.example.com');
  });

  it('does not serve a document or return a paperServicePdfUrl if only the serviceIndicator changes but not the address', async () => {
    const result = await updatePetitionerInformationInteractor({
      applicationContext,
      contactPrimary: {
        ...MOCK_CASE.contactPrimary,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      },
      docketNumber: MOCK_CASE.docketNumber,
      partyType: PARTY_TYPES.petitioner,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).not.toHaveBeenCalled();
    expect(result.paperServicePdfUrl).toBeUndefined();
  });

  it('does not update contactPrimary email if it is passed in', async () => {
    await updatePetitionerInformationInteractor({
      applicationContext,
      contactPrimary: {
        ...MOCK_CASE.contactPrimary,
        email: 'test@example.com',
      },
      docketNumber: MOCK_CASE.docketNumber,
      partyType: PARTY_TYPES.petitioner,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.contactPrimary.email,
    ).not.toBe('test@example.com');
  });

  it('should update contactSecondary.inCareOf when the party type is petitioner and deceased spouse and it is passed in', async () => {
    mockCase = MOCK_CASE_WITH_SECONDARY_OTHERS;
    const mockInCareOf = 'Tina Belcher';

    await updatePetitionerInformationInteractor({
      applicationContext,
      contactPrimary: {
        ...MOCK_CASE_WITH_SECONDARY_OTHERS.contactPrimary,
        email: 'test@example.com',
      },
      contactSecondary: {
        ...MOCK_CASE_WITH_SECONDARY_OTHERS.contactSecondary,
        inCareOf: mockInCareOf,
      },
      docketNumber: MOCK_CASE_WITH_SECONDARY_OTHERS.docketNumber,
      partyType: PARTY_TYPES.petitionerDeceasedSpouse,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.contactSecondary.inCareOf,
    ).toBe(mockInCareOf);
  });

  it('throws an error when attempting to update contactPrimary.countryType to an invalid value', async () => {
    await expect(
      updatePetitionerInformationInteractor({
        applicationContext,
        contactPrimary: {
          ...MOCK_CASE.contactPrimary,
          countryType: 'alien',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
        docketNumber: MOCK_CASE.docketNumber,
        partyType: PARTY_TYPES.petitioner,
      }),
    ).rejects.toThrow('The Case entity was invalid');

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toHaveBeenCalled();
  });

  it('throws an error if the user making the request does not have permission to edit petition details', async () => {
    mockUser.role = ROLES.petitioner;

    await expect(
      updatePetitionerInformationInteractor({
        applicationContext,
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for editing petition details');
  });

  describe('createWorkItemForChange', () => {
    it('should create a work item for the NCA when the primary contact is unrepresented', async () => {
      mockUser.role = ROLES.docketClerk;
      mockCase = {
        ...MOCK_CASE,
        contactPrimary: {
          address1: '789 Division St',
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Test Petitioner',
          phone: '1234567',
          postalCode: '12345',
          state: 'TN',
          title: 'Executor',
        },
        partyType: PARTY_TYPES.petitioner,
        privatePractitioners: [],
      };

      const result = await updatePetitionerInformationInteractor({
        applicationContext,
        contactPrimary: {
          address1: '789 Division St APT 123', //changed address1
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Test Petitioner',
          phone: '1234567',
          postalCode: '12345',
          state: 'TN',
          title: 'Executor',
        },
        docketNumber: MOCK_CASE.docketNumber,
        partyType: PARTY_TYPES.petitioner,
      });

      const noticeOfChangeDocketEntryWithWorkItem = result.updatedCase.docketEntries.find(
        d => d.eventCode === 'NCA',
      );

      expect(
        applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
      ).toHaveBeenCalled();
      expect(noticeOfChangeDocketEntryWithWorkItem.workItem).toBeDefined();
      expect(noticeOfChangeDocketEntryWithWorkItem.additionalInfo).toBe(
        'for Test Petitioner',
      );
    });

    it('should create a work item for the NCA when the secondary contact is unrepresented', async () => {
      mockCase = {
        ...MOCK_CASE,
        contactSecondary: {
          address1: '789 Division St',
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Test Secondary Petitioner',
          phone: '1234567',
          postalCode: '12345',
          state: 'TN',
          title: 'Executor',
        },
        partyType: PARTY_TYPES.petitionerSpouse,
        privatePractitioners: [],
      };

      const result = await updatePetitionerInformationInteractor({
        applicationContext,
        contactPrimary: MOCK_CASE.contactPrimary,
        contactSecondary: {
          address1: '789 Division St APT 123', //changed address1
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Test Secondary Petitioner',
          phone: '1234567',
          postalCode: '12345',
          state: 'TN',
          title: 'Executor',
        },
        docketNumber: MOCK_CASE.docketNumber,
        partyType: PARTY_TYPES.petitionerSpouse,
      });

      const noticeOfChangeDocketEntryWithWorkItem = result.updatedCase.docketEntries.find(
        d => d.eventCode === 'NCA',
      );

      expect(
        applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
      ).toHaveBeenCalled();
      expect(noticeOfChangeDocketEntryWithWorkItem.workItem).toBeDefined();
      expect(noticeOfChangeDocketEntryWithWorkItem.additionalInfo).toBe(
        'for Test Secondary Petitioner',
      );
    });

    it('should NOT create a work item for the NCA when the primary contact is represented and their service preference is NOT paper', async () => {
      mockCase = {
        ...MOCK_CASE,
        contactPrimary: {
          address1: '789 Division St',
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Test Petitioner',
          phone: '1234567',
          postalCode: '12345',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
          state: 'TN',
          title: 'Executor',
        },
        partyType: PARTY_TYPES.petitioner,
        privatePractitioners: [
          { ...basePractitioner, representingPrimary: true },
        ],
      };

      const result = await updatePetitionerInformationInteractor({
        applicationContext,
        contactPrimary: {
          address1: '789 Division St APT 123', //changed address1
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Test Petitioner',
          phone: '1234567',
          postalCode: '12345',
          state: 'TN',
          title: 'Executor',
        },
        docketNumber: MOCK_CASE.docketNumber,
        partyType: PARTY_TYPES.petitioner,
      });

      const noticeOfChangeDocketEntryWithWorkItem = result.updatedCase.docketEntries.find(
        d => d.eventCode === 'NCA',
      );

      expect(
        applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
      ).not.toHaveBeenCalled();
      expect(noticeOfChangeDocketEntryWithWorkItem.workItem).toBeUndefined();
      expect(noticeOfChangeDocketEntryWithWorkItem.additionalInfo).toBe(
        'for Test Petitioner',
      );
    });

    it('should NOT create a work item for the NCA when the secondary contact is represented and their service preference is NOT paper', async () => {
      mockCase = {
        ...MOCK_CASE,
        contactPrimary: MOCK_CASE.contactPrimary,
        contactSecondary: {
          address1: '789 Division St',
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Test Secondary Petitioner',
          phone: '1234567',
          postalCode: '12345',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          state: 'TN',
          title: 'Executor',
        },
        partyType: PARTY_TYPES.petitionerSpouse,
        privatePractitioners: [
          { ...basePractitioner, representingSecondary: true },
        ],
      };

      const result = await updatePetitionerInformationInteractor({
        applicationContext,
        contactPrimary: MOCK_CASE.contactPrimary,
        contactSecondary: {
          address1: '789 Division St APT 123', //changed address1
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Test Secondary Petitioner',
          phone: '1234567',
          postalCode: '12345',
          state: 'TN',
          title: 'Executor',
        },
        docketNumber: MOCK_CASE.docketNumber,
        partyType: PARTY_TYPES.petitionerSpouse,
      });

      const noticeOfChangeDocketEntryWithWorkItem = result.updatedCase.docketEntries.find(
        d => d.eventCode === 'NCA',
      );

      expect(
        applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
      ).not.toHaveBeenCalled();
      expect(noticeOfChangeDocketEntryWithWorkItem.workItem).toBeUndefined();
      expect(noticeOfChangeDocketEntryWithWorkItem.additionalInfo).toBe(
        'for Test Secondary Petitioner',
      );
    });

    it('should create a work item for the NCA when the primary contact is represented and their service preference is paper', async () => {
      mockCase = {
        ...MOCK_CASE,
        contactPrimary: {
          address1: '789 Division St',
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Test Petitioner',
          phone: '1234567',
          postalCode: '12345',
          state: 'TN',
          title: 'Executor',
        },
        partyType: PARTY_TYPES.petitioner,
        privatePractitioners: [
          { ...basePractitioner, representingPrimary: true },
        ],
      };

      const result = await updatePetitionerInformationInteractor({
        applicationContext,
        contactPrimary: {
          address1: '789 Division St APT 123', //changed address1
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Test Petitioner',
          phone: '1234567',
          postalCode: '12345',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          state: 'TN',
          title: 'Executor',
        },
        docketNumber: MOCK_CASE.docketNumber,
        partyType: PARTY_TYPES.petitioner,
      });

      const noticeOfChangeDocketEntryWithWorkItem = result.updatedCase.docketEntries.find(
        d => d.eventCode === 'NCA',
      );

      expect(
        applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
      ).toHaveBeenCalled();
      expect(noticeOfChangeDocketEntryWithWorkItem.workItem).toBeDefined();
      expect(noticeOfChangeDocketEntryWithWorkItem.additionalInfo).toBe(
        'for Test Petitioner',
      );
    });

    it('should create a work item for the NCA when the secondary contact is represented and their service preference is paper', async () => {
      mockCase = {
        ...MOCK_CASE,
        contactPrimary: MOCK_CASE.contactPrimary,
        contactSecondary: {
          address1: '789 Division St',
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Test Secondary Petitioner',
          phone: '1234567',
          postalCode: '12345',
          state: 'TN',
          title: 'Executor',
        },
        partyType: PARTY_TYPES.petitionerSpouse,
        privatePractitioners: [
          { ...basePractitioner, representingSecondary: true },
        ],
      };

      const result = await updatePetitionerInformationInteractor({
        applicationContext,
        contactPrimary: MOCK_CASE.contactPrimary,
        contactSecondary: {
          address1: '789 Division St APT 123', //changed address1
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Test Secondary Petitioner',
          phone: '1234567',
          postalCode: '12345',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          state: 'TN',
          title: 'Executor',
        },
        docketNumber: MOCK_CASE.docketNumber,
        partyType: PARTY_TYPES.petitionerSpouse,
      });

      const noticeOfChangeDocketEntryWithWorkItem = result.updatedCase.docketEntries.find(
        d => d.eventCode === 'NCA',
      );

      expect(
        applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
      ).toHaveBeenCalled();
      expect(noticeOfChangeDocketEntryWithWorkItem.workItem).toBeDefined();
      expect(noticeOfChangeDocketEntryWithWorkItem.additionalInfo).toBe(
        'for Test Secondary Petitioner',
      );
    });
  });
});
