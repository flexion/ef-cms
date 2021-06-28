import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkEditsPetitionerInformation } from './journey/docketClerkEditsPetitionerInformation';
import { docketClerkEditsServiceIndicatorForPetitioner } from './journey/docketClerkEditsServiceIndicatorForPetitioner';
import { docketClerkEditsServiceIndicatorForPractitioner } from './journey/docketClerkEditsServiceIndicatorForPractitioner';
import { docketClerkEditsServiceIndicatorForRespondent } from './journey/docketClerkEditsServiceIndicatorForRespondent';
import { docketClerkServesOrderOnPaperParties } from './journey/docketClerkServesOrderOnPaperParties';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

const integrationTest = setupTest();
integrationTest.draftOrders = [];

describe('Docket Clerk edits service indicators for petitioner, practitioner, and respondent', () => {
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

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkEditsPetitionerInformation(integrationTest);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(integrationTest);
  petitionsClerkAddsRespondentsToCase(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkEditsServiceIndicatorForPetitioner(integrationTest);
  docketClerkEditsServiceIndicatorForPractitioner(integrationTest);
  docketClerkEditsServiceIndicatorForRespondent(integrationTest);
  // create an order to serve - it should be served to 3 paper service parties now
  docketClerkCreatesAnOrder(integrationTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkSignsOrder(integrationTest, 0);
  docketClerkAddsDocketEntryFromOrder(integrationTest, 0);
  docketClerkServesOrderOnPaperParties(integrationTest, 0);
});
