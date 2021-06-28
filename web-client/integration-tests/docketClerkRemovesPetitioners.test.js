import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsPetitionerToCase } from './journey/docketClerkAddsPetitionerToCase';
import { docketClerkRemovesIntervenorFromCase } from './journey/docketClerkRemovesIntervenorFromCase';
import { docketClerkRemovesPetitionerFromCase } from './journey/docketClerkRemovesPetitionerFromCase';
import { docketClerkVerifiesPractitionerStillExistsOnCase } from './journey/docketClerkVerifiesPractitionerStillExistsOnCase';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

const integrationTest = setupTest();
integrationTest.draftOrders = [];

describe('Docket Clerk removes petitioners journey', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');

  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(integrationTest, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Jimothy Schultz',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(integrationTest);

  const overrides = {
    contactType: 'intervenor',
    name: 'Test Intervenor',
  };

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkAddsPetitionerToCase(integrationTest, overrides);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(integrationTest, true);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkRemovesIntervenorFromCase(integrationTest);

  docketClerkVerifiesPractitionerStillExistsOnCase(integrationTest);

  docketClerkRemovesPetitionerFromCase(integrationTest);
});
