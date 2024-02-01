import {
  CONTACT_TYPES,
  PARTY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import {
  MOCK_CASE,
  MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
} from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getContactPrimary } from '@shared/business/entities/cases/Case';
import {
  updatePetitionerCases,
  updatePractitionerCases,
} from './updateAssociatedCaseWorker';
import { validUser } from '@shared/test/mockUsers';

describe('updatePetitionerCases', () => {
  const UPDATED_EMAIL = 'hello@example.com';
  const mockPetitionerUser = {
    ...validUser,
    email: UPDATED_EMAIL,
    role: ROLES.petitioner,
    userId: getContactPrimary(MOCK_CASE).contactId,
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
  });

  it('should call getCaseByDocketNumber for each docketNumber passed in', async () => {
    const casesMock = [
      {
        ...MOCK_CASE,
        docketNumber: '101-21',
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockPetitionerUser.userId,
          },
        ],
      },
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockPetitionerUser.userId,
          },
        ],
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) =>
        casesMock.find(c => c.docketNumber === docketNumber),
      );

    await updatePetitionerCases({
      applicationContext,
      docketNumbersAssociatedWithUser: ['101-21', MOCK_CASE.docketNumber],
      user: mockPetitionerUser,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0],
    ).toMatchObject({
      docketNumber: '101-21',
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[1][0],
    ).toMatchObject({
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalled();
  });

  it('should log an error if the petitioner is not found on a case returned by getCasesForUser and call updateCaseAndAssociations only once', async () => {
    const casesMock = [
      {
        ...MOCK_CASE,
        docketNumber: '101-21',
      },
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            contactId: 'some-other-uuid',
          },
        ],
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) =>
        casesMock.find(c => c.docketNumber === docketNumber),
      );

    await expect(
      updatePetitionerCases({
        applicationContext,
        docketNumbersAssociatedWithUser: ['101-21', MOCK_CASE.docketNumber],
        user: mockPetitionerUser,
      }),
    ).resolves.not.toThrow();

    expect(applicationContext.logger.error).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalledTimes(1);
  });

  it('should log an error if any case update is invalid and prevent updateCaseAndAssociations from being called', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        docketNumber: 'not a docket number',
        invalidCase: 'yep',
      });

    await expect(
      updatePetitionerCases({
        applicationContext,
        docketNumbersAssociatedWithUser: [MOCK_CASE.docketNumber],
        user: mockPetitionerUser,
      }),
    ).rejects.toThrow('entity was invalid');

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).not.toHaveBeenCalled();
  });

  it('should call updateCaseAndAssociations with updated email address for a contactSecondary', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            contactId: '41189629-abe1-46d7-b7a4-9d3834f919cb',
          },
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockPetitionerUser.userId,
            contactType: CONTACT_TYPES.secondary,
            inCareOf: 'Barney',
          },
        ],
      });

    await updatePetitionerCases({
      applicationContext,
      docketNumbersAssociatedWithUser: [MOCK_CASE.docketNumber],
      user: mockPetitionerUser,
    });

    const { caseToUpdate } =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0];
    expect(caseToUpdate.petitioners[1].email).toBe(UPDATED_EMAIL);
    expect(caseToUpdate.docketNumber).toBe(MOCK_CASE.docketNumber);
  });

  it('should update the petitioner service indicator when they are not represented', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            contactId: '41189629-abe1-46d7-b7a4-9d3834f919cb',
          },
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockPetitionerUser.userId,
            contactType: CONTACT_TYPES.secondary,
            inCareOf: 'Barney',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
          },
        ],
        privatePractitioners: [
          {
            ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS.privatePractitioners[0],
            representing: [],
          },
        ],
      });

    await updatePetitionerCases({
      applicationContext,
      docketNumbersAssociatedWithUser: [MOCK_CASE.docketNumber],
      user: mockPetitionerUser,
    });

    const { caseToUpdate } =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0];

    expect(caseToUpdate.petitioners[1].serviceIndicator).toBe(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
    expect(caseToUpdate.docketNumber).toBe(MOCK_CASE.docketNumber);
  });

  it('should update the petitioner service indicator when they are represented', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        petitioners: [
          ...MOCK_CASE.petitioners,
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockPetitionerUser.userId,
            contactType: CONTACT_TYPES.secondary,
            inCareOf: 'Barney',
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
          },
        ],
        privatePractitioners: [
          {
            ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS.privatePractitioners[0],
            representing: [mockPetitionerUser.userId],
          },
        ],
      });

    await updatePetitionerCases({
      applicationContext,
      docketNumbersAssociatedWithUser: [MOCK_CASE.docketNumber],
      user: mockPetitionerUser,
    });

    const { caseToUpdate } =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0];

    expect(caseToUpdate.petitioners[1].serviceIndicator).toBe(
      SERVICE_INDICATOR_TYPES.SI_NONE,
    );
    expect(caseToUpdate.docketNumber).toBe(MOCK_CASE.docketNumber);
  });
});

describe('updatePractitionerCases', () => {
  let mockPractitionerUser;
  const UPDATED_EMAIL = 'hello@example.com';

  beforeEach(() => {
    mockPractitionerUser = {
      ...validUser,
      barNumber: 'SS8888',
      email: UPDATED_EMAIL,
      role: ROLES.privatePractitioner,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        privatePractitioners: [mockPractitionerUser],
      });
  });

  it('should set the service serviceIndicator to ELECTRONIC when confirming the email', async () => {
    await updatePractitionerCases({
      applicationContext,
      docketNumbersAssociatedWithUser: [MOCK_CASE.docketNumber],
      user: mockPractitionerUser,
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate.privatePractitioners[0].serviceIndicator,
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_ELECTRONIC);
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledTimes(2);
  });
});