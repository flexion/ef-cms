const {
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} = require('../entities/EntityConstants');
const {
  updatePetitionerInformationInteractor,
} = require('./updatePetitionerInformationInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { PARTY_TYPES, ROLES } = require('../entities/EntityConstants');
const { User } = require('../entities/User');
let { applicationContext } = require('../test/createTestApplicationContext');

const updateCaseStub = jest.fn();
const saveDocumentFromLambdaStub = jest.fn();

let persistenceGateway = {
  getCaseByCaseId: () => MOCK_CASE,
  getDownloadPolicyUrl: () => ({
    url: 'https://www.example.com',
  }),
  saveDocumentFromLambda: saveDocumentFromLambdaStub,
  saveWorkItemForNonPaper: () => null,
  updateCase: updateCaseStub,
};

const userData = {
  name: 'administrator',
  role: ROLES.docketClerk,
  userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
};
let userObj = userData;

applicationContext.getCurrentUser.mockImplementation(() => new User(userObj));
applicationContext.getPersistenceGateway.mockReturnValue(persistenceGateway);

describe('update petitioner contact information on a case', () => {
  beforeEach(() => {
    userObj = userData;
  });

  it('updates case even if no change of address or phone is detected', async () => {
    await updatePetitionerInformationInteractor({
      applicationContext,
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      contactPrimary: MOCK_CASE.contactPrimary,
      partyType: PARTY_TYPES.petitioner,
    });
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).not.toHaveBeenCalled();
    expect(updateCaseStub).toHaveBeenCalled();
  });

  it('throws an error if contactSecondary is required for the party type and is not valid', async () => {
    await expect(
      updatePetitionerInformationInteractor({
        applicationContext,
        caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        contactPrimary: MOCK_CASE.contactPrimary,
        contactSecondary: { countryType: COUNTRY_TYPES.DOMESTIC },
        partyType: PARTY_TYPES.petitionerSpouse,
      }),
    ).rejects.toThrow();
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).not.toHaveBeenCalled();
    expect(updateCaseStub).not.toHaveBeenCalled();
  });

  it('updates petitioner contact when primary contact info changes and serves the notice created', async () => {
    await updatePetitionerInformationInteractor({
      applicationContext,
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
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
      partyType: PARTY_TYPES.petitioner,
    });

    const autoGeneratedDocument = updateCaseStub.mock.calls[0][0].caseToUpdate.documents.find(
      d => d.documentType === 'Notice of Change of Address',
    );

    expect(autoGeneratedDocument).toMatchObject({
      isAutoGenerated: true,
    });
    expect(updateCaseStub).toHaveBeenCalled();
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
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
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
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(updateCaseStub).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).not.toHaveBeenCalled();
  });

  it('updates petitioner contact when secondary contact info changes, serves the generated notice, and returns the download URL for the paper notice if the contactSecondary was previously on the case', async () => {
    persistenceGateway.getCaseByCaseId = () => ({
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
    });

    const result = await updatePetitionerInformationInteractor({
      applicationContext,
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
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
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(updateCaseStub).toHaveBeenCalled();
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
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      contactPrimary: {
        ...MOCK_CASE.contactPrimary,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      },
      partyType: PARTY_TYPES.petitioner,
    });
    expect(updateCaseStub).toHaveBeenCalled();
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
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      contactPrimary: {
        ...MOCK_CASE.contactPrimary,
        email: 'test@example.com',
      },
      partyType: PARTY_TYPES.petitioner,
    });
    expect(updateCaseStub).toHaveBeenCalled();
    expect(
      updateCaseStub.mock.calls[0][0].caseToUpdate.contactPrimary.email,
    ).not.toBe('test@example.com');
  });

  it('throws an error when attempting to update contactPrimary.countryType to an invalid value', async () => {
    await expect(
      updatePetitionerInformationInteractor({
        applicationContext,
        caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        contactPrimary: {
          ...MOCK_CASE.contactPrimary,
          countryType: 'alien',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
        partyType: PARTY_TYPES.petitioner,
      }),
    ).rejects.toThrow('The Case entity was invalid');
    expect(updateCaseStub).not.toHaveBeenCalled();
  });

  it('throws an error if the user making the request does not have permission to edit petition details', async () => {
    persistenceGateway.getCaseByCaseId = async () => ({
      ...MOCK_CASE,
    });
    userObj.role = ROLES.petitioner;
    await expect(
      updatePetitionerInformationInteractor({
        applicationContext,
        caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).rejects.toThrow('Unauthorized for editing petition details');
  });
});
