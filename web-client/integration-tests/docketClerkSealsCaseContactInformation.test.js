import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  contactPrimaryFromState,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';
import { docketClerkSealsContactInformation } from './journey/docketClerkSealsContactInformation';
import { docketClerkUpdatesSealedContactAddress } from './journey/docketClerkUpdatesSealedContactAddress';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { petitionsClerkViewsCaseWithSealedContact } from './journey/petitionsClerkViewsCaseWithSealedContact';

const integrationTest = setupTest();
integrationTest.draftOrders = [];
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('Docket Clerk seals a case contact information', () => {
  let contactType;

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
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'NOTAREALNAMEFORTESTING',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;

    integrationTest.contactId =
      contactPrimaryFromState(integrationTest).contactId;
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  contactType = 'contactPrimary';
  docketClerkSealsContactInformation(integrationTest, contactType);
  docketClerkUpdatesSealedContactAddress(integrationTest, contactType);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseWithSealedContact(integrationTest, contactType);

  loginAs(integrationTest, 'docketclerk@example.com');
  contactType = 'contactSecondary';
  docketClerkSealsContactInformation(integrationTest, contactType);
  docketClerkUpdatesSealedContactAddress(integrationTest, contactType);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseWithSealedContact(integrationTest, contactType);
});
