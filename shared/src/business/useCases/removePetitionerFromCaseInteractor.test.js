const {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  ROLES,
} = require('../entities/EntityConstants');
const {
  getContactPrimary,
  getPetitionerById,
} = require('../entities/cases/Case');
const {
  removePetitionerFromCaseInteractor,
} = require('./removePetitionerFromCaseInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { UnauthorizedError } = require('../../errors/errors');

describe('removePetitionerFromCaseInteractor', () => {
  let mockCase;
  let petitionerToRemove;
  const SECONDARY_CONTACT_ID = '56387318-0092-49a3-8cc1-921b0432bd16';
  beforeEach(() => {
    petitionerToRemove = {
      address1: '2729 Chicken St',
      city: 'Eggyolk',
      contactId: SECONDARY_CONTACT_ID,
      contactType: CONTACT_TYPES.secondary,
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Eggy Egg',
      phone: '123456',
      postalCode: '55555',
      state: 'CO',
    };

    mockCase = {
      ...MOCK_CASE,
      petitioners: [getContactPrimary(MOCK_CASE), petitionerToRemove],
      status: CASE_STATUS_TYPES.generalDocket,
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => mockCase);

    applicationContext
      .getPersistenceGateway()
      .deleteUserFromCase.mockImplementation(() => null);
  });

  it('should throw an unauthorized error when the current user does not have permission to edit petitioners', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    });
    await expect(
      removePetitionerFromCaseInteractor(applicationContext, {
        caseCaption: MOCK_CASE.caseCaption,
        contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw an error if the case status is new', async () => {
    mockCase = {
      ...mockCase,
      status: CASE_STATUS_TYPES.new,
    };

    await expect(
      removePetitionerFromCaseInteractor(applicationContext, {
        caseCaption: MOCK_CASE.caseCaption,
        contactId: SECONDARY_CONTACT_ID,
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(
      `Case with docketNumber ${mockCase.docketNumber} has not been served`,
    );
  });

  it('should throw an error when there is only one petitioner left on the case', async () => {
    mockCase = {
      ...MOCK_CASE,
      petitioners: [getContactPrimary(MOCK_CASE)],
      status: CASE_STATUS_TYPES.generalDocket,
    };

    await expect(
      removePetitionerFromCaseInteractor(applicationContext, {
        caseCaption: MOCK_CASE.caseCaption,
        contactId: getContactPrimary(MOCK_CASE).contactId,
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(
      `Cannot remove petitioner ${
        getContactPrimary(MOCK_CASE).contactId
      } from case with docketNumber ${MOCK_CASE.docketNumber}`,
    );
  });

  it('should remove the specified petitioner form the case petitioners array', async () => {
    await removePetitionerFromCaseInteractor(applicationContext, {
      caseCaption: MOCK_CASE.caseCaption,
      contactId: petitionerToRemove.contactId,
      docketNumber: MOCK_CASE.docketNumber,
    });

    const {
      caseToUpdate,
    } = applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock.calls[0][0];

    expect(
      getPetitionerById(caseToUpdate, petitionerToRemove.contactId),
    ).toBeUndefined();
    expect(
      applicationContext.getPersistenceGateway().deleteUserFromCase.mock
        .calls[0][0].userId,
    ).toEqual(petitionerToRemove.contactId);
  });

  it('should remove practitioner from case when they only represented the removed petitioner', async () => {
    const mockPrivatePractitioner = {
      barNumber: 'b1234',
      name: 'Test Practitioner',
      representing: [petitionerToRemove.contactId],
      role: ROLES.privatePractitioner,
      userId: '5b7e10a2-f9df-4ee8-bbb0-c01a698fdd32',
    };
    mockCase = {
      ...mockCase,
      privatePractitioners: [mockPrivatePractitioner],
    };

    await removePetitionerFromCaseInteractor(applicationContext, {
      caseCaption: mockCase.caseCaption,
      contactId: petitionerToRemove.contactId,
      docketNumber: mockCase.docketNumber,
    });

    const {
      caseToUpdate,
    } = applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock.calls[0][0];

    expect(
      applicationContext.getPersistenceGateway().deleteUserFromCase.mock
        .calls[0][0].userId,
    ).toEqual(mockPrivatePractitioner.userId);
    expect(
      applicationContext.getPersistenceGateway().deleteUserFromCase.mock
        .calls[1][0].userId,
    ).toEqual(petitionerToRemove.contactId);

    expect(caseToUpdate.privatePractitioners.length).toEqual(0);
  });

  it('should reassign contactPrimary to another petitioner on the case when the petitioner to remove is the current contactPrimary', async () => {
    await removePetitionerFromCaseInteractor(applicationContext, {
      caseCaption: mockCase.caseCaption,
      contactId: getContactPrimary(MOCK_CASE).contactId,
      docketNumber: mockCase.docketNumber,
    });

    const {
      caseToUpdate,
    } = applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock.calls[0][0];

    expect(getContactPrimary(caseToUpdate)).toBeDefined();
  });
});
