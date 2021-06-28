import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkDoesNotViewQCItemForNCAForCaseWithNoPaperService } from './journey/docketClerkDoesNotViewQCItemForNCAForCaseWithNoPaperService';
import { docketClerkDoesNotViewQCItemForNCAForRepresentedPetitioner } from './journey/docketClerkDoesNotViewQCItemForNCAForRepresentedPetitioner';
import { docketClerkEditsServiceIndicatorForPetitioner } from './journey/docketClerkEditsServiceIndicatorForPetitioner';
import { docketClerkQCsNCAForCaseWithPaperService } from './journey/docketClerkQCsNCAForCaseWithPaperService';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerEditsCasePrimaryContactAddress } from './journey/petitionerEditsCasePrimaryContactAddress';
import { petitionerNavigatesToEditContact } from './journey/petitionerNavigatesToEditContact';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { practitionerUpdatesAddress } from './journey/practitionerUpdatesAddress';

const integrationTest = setupTest();
integrationTest.draftOrders = [];

describe('noticeOfChangeOfAddressQCJourney', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

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
    expect(caseDetail.privatePractitioners).toEqual([]);
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(integrationTest);
  petitionsClerkAddsPractitionersToCase(integrationTest);

  loginAs(integrationTest, 'petitioner@example.com');
  petitionerNavigatesToEditContact(integrationTest);
  petitionerEditsCasePrimaryContactAddress(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkDoesNotViewQCItemForNCAForRepresentedPetitioner(integrationTest);

  loginAs(integrationTest, 'privatePractitioner@example.com');
  practitionerUpdatesAddress(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkDoesNotViewQCItemForNCAForCaseWithNoPaperService(integrationTest);
  docketClerkEditsServiceIndicatorForPetitioner(integrationTest);

  loginAs(integrationTest, 'privatePractitioner@example.com');
  practitionerUpdatesAddress(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkQCsNCAForCaseWithPaperService(integrationTest);
});
