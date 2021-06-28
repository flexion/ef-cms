import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { associatedUserAdvancedSearchForSealedCase } from './journey/associatedUserAdvancedSearchForSealedCase';
import { associatedUserViewsCaseDetailForSealedCase } from './journey/associatedUserViewsCaseDetailForSealedCase';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSealsCase } from './journey/docketClerkSealsCase';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { externalUserSearchesForAnOrderOnSealedCase } from './journey/externalUserSearchesForAnOrderOnSealedCase';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { unassociatedUserAdvancedSearchForSealedCase } from './journey/unassociatedUserAdvancedSearchForSealedCase';
import { unassociatedUserViewsCaseDetailForSealedCase } from './journey/unassociatedUserViewsCaseDetailForSealedCase';

const integrationTest = setupTest();
integrationTest.draftOrders = [];
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('Docket Clerk seals a case', () => {
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
    console.log('new case docket#', caseDetail.docketNumber);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(integrationTest);
  petitionsClerkAddsPractitionersToCase(integrationTest);
  petitionsClerkAddsRespondentsToCase(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkSealsCase(integrationTest);
  docketClerkCreatesAnOrder(integrationTest, {
    documentTitle: 'Order for a sealed case',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(integrationTest, 0);
  docketClerkAddsDocketEntryFromOrder(integrationTest, 0);
  docketClerkServesDocument(integrationTest, 0);

  //verify that an internal user can still find this case via advanced search by name
  loginAs(integrationTest, 'petitionsclerk@example.com');
  associatedUserAdvancedSearchForSealedCase(integrationTest);

  //associated users
  loginAs(integrationTest, 'petitioner@example.com');
  associatedUserViewsCaseDetailForSealedCase(integrationTest);

  loginAs(integrationTest, 'privatePractitioner@example.com');
  associatedUserViewsCaseDetailForSealedCase(integrationTest);
  associatedUserAdvancedSearchForSealedCase(integrationTest);

  loginAs(integrationTest, 'irsPractitioner@example.com');
  associatedUserViewsCaseDetailForSealedCase(integrationTest);
  associatedUserAdvancedSearchForSealedCase(integrationTest);

  //unassociated users
  loginAs(integrationTest, 'privatePractitioner3@example.com');
  unassociatedUserViewsCaseDetailForSealedCase(integrationTest);
  unassociatedUserAdvancedSearchForSealedCase(integrationTest);
  externalUserSearchesForAnOrderOnSealedCase(integrationTest);

  loginAs(integrationTest, 'irsPractitioner3@example.com');
  unassociatedUserViewsCaseDetailForSealedCase(integrationTest);
  unassociatedUserAdvancedSearchForSealedCase(integrationTest);
});
