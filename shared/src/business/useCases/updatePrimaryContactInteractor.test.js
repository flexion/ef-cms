const {
  applicationContext,
  fakeData,
} = require('../test/createTestApplicationContext');
const {
  updatePrimaryContactInteractor,
} = require('./updatePrimaryContactInteractor');
const { COUNTRY_TYPES, ROLES } = require('../entities/EntityConstants');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

describe('update primary contact on a case', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    applicationContext
      .getUseCases()
      .generatePdfFromHtmlInteractor.mockReturnValue(fakeData);

    applicationContext
      .getDocumentGenerators()
      .changeOfAddress.mockReturnValue(fakeData);

    applicationContext.getUseCases().userIsAssociated.mockReturnValue(true);

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: ROLES.petitioner,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    applicationContext
      .getChromiumBrowser()
      .newPage()
      .pdf.mockReturnValue(fakeData);

    applicationContext.getUtilities().getAddressPhoneDiff.mockReturnValue({
      address1: {
        newData: 'new test',
        oldData: 'test',
      },
    });

    applicationContext
      .getUtilities()
      .getDocumentTypeForAddressChange.mockReturnValue({
        eventCode: 'NCA',
        title: 'Notice of Change of Address',
      });
  });

  it('should update contactPrimary editable fields', async () => {
    const mockNumberOfPages = 999;
    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockReturnValue(mockNumberOfPages);

    const caseDetail = await updatePrimaryContactInteractor({
      applicationContext,
      contactInfo: {
        address1: '453 Electric Ave',
        city: 'Philadelphia',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'petitioner',
        name: 'Bill Burr',
        phone: '1234567890',
        postalCode: '99999',
        state: 'PA',
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    const updatedCase = applicationContext.getPersistenceGateway().updateCase
      .mock.calls[0][0].caseToUpdate;
    const changeOfAddressDocument = updatedCase.docketEntries.find(
      d => d.documentType === 'Notice of Change of Address',
    );
    expect(updatedCase.contactPrimary).toMatchObject({
      address1: '453 Electric Ave',
      city: 'Philadelphia',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: MOCK_CASE.contactPrimary.email,
      name: MOCK_CASE.contactPrimary.name,
      phone: '1234567890',
      postalCode: '99999',
      state: 'PA',
    });
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).toHaveBeenCalled();

    expect(changeOfAddressDocument).toMatchObject({
      isAutoGenerated: true,
      isFileAttached: true,
      numberOfPages: mockNumberOfPages,
    });
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
    expect(caseDetail.docketEntries[4].servedAt).toBeDefined();
  });

  it('creates a work item if the primary contact is not represented by a privatePractitioner', async () => {
    await updatePrimaryContactInteractor({
      applicationContext,
      contactInfo: {
        address1: '453 Electric Ave',
        city: 'Philadelphia',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'petitioner',
        name: 'Bill Burr',
        phone: '1234567890',
        postalCode: '99999',
        state: 'PA',
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
    ).toBeCalled();
  });

  it('does not create a work item if the primary contact is represented by a privatePractitioner', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        privatePractitioners: [
          {
            barNumber: '1111',
            name: 'Bob Practitioner',
            representingPrimary: true,
            role: ROLES.privatePractitioner,
            userId: '5b992eca-8573-44ff-a33a-7796ba0f201c',
          },
        ],
      });

    await updatePrimaryContactInteractor({
      applicationContext,
      contactInfo: {
        address1: '453 Electric Ave',
        city: 'Philadelphia',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'petitioner',
        name: 'Bill Burr',
        phone: '1234567890',
        postalCode: '99999',
        state: 'PA',
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
    ).not.toBeCalled();
  });

  it('throws an error if the case was not found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(null);

    await expect(
      updatePrimaryContactInteractor({
        applicationContext,
        contactInfo: {},
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Case 101-18 was not found.');
  });

  it('throws an error if the user making the request is not associated with the case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue({
        ...MOCK_CASE,
        userId: '123',
      });

    applicationContext.getUseCases().userIsAssociated.mockReturnValue(false);

    await expect(
      updatePrimaryContactInteractor({
        applicationContext,
        contactInfo: {},
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for update case contact');
  });

  it('does not update the case if the contact information does not change', async () => {
    applicationContext
      .getUtilities()
      .getDocumentTypeForAddressChange.mockReturnValue(undefined);

    await updatePrimaryContactInteractor({
      applicationContext,
      contactInfo: {
        // Matches current contact info
        address1: '123 Main St',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'petitioner@example.com',
        name: 'Test Petitioner',
        phone: '1234567',
        postalCode: '12345',
        state: 'TN',
        title: 'Executor',
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().generatePdfFromHtmlInteractor,
    ).not.toHaveBeenCalled();
  });

  it('does not update the contact primary email or name', async () => {
    const getUtilities = applicationContext.getUtilities();
    applicationContext.getUtilities = () => ({
      ...getUtilities,
      getDocumentTypeForAddressChange: () => undefined, // returns undefined when there is no diff
    });

    const caseDetail = await updatePrimaryContactInteractor({
      applicationContext,
      contactInfo: {
        address1: 'nothing',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'hello123@example.com',
        name: 'Secondary Party Name Changed',
        phone: '9876543210',
        postalCode: '12345',
        state: 'TN',
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(caseDetail.contactPrimary.name).not.toBe(
      'Secondary Party Name Changed',
    );
    expect(caseDetail.contactPrimary.name).toBe('Test Petitioner');
    expect(caseDetail.contactPrimary.email).not.toBe('hello123@example.com');
    expect(caseDetail.contactPrimary.email).toBe('petitioner@example.com');
  });
});
