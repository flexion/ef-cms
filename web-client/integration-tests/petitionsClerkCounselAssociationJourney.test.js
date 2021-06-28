import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { petitionsClerkEditsPractitionerOnCase } from './journey/petitionsClerkEditsPractitionerOnCase';
import { petitionsClerkRemovesPractitionerFromCase } from './journey/petitionsClerkRemovesPractitionerFromCase';
import { petitionsClerkRemovesRespondentFromCase } from './journey/petitionsClerkRemovesRespondentFromCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';

const integrationTest = setupTest();
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('Petitions Clerk Counsel Association Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  it('Create test case', async () => {
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
  petitionsClerkViewsCaseDetail(integrationTest);
  petitionsClerkAddsPractitionersToCase(integrationTest);
  petitionsClerkAddsRespondentsToCase(integrationTest);
  petitionsClerkEditsPractitionerOnCase(integrationTest);
  petitionsClerkRemovesPractitionerFromCase(integrationTest);
  petitionsClerkRemovesRespondentFromCase(integrationTest);
});
