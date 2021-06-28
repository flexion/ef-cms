import { ADVANCED_SEARCH_TABS } from '../../shared/src/business/entities/EntityConstants';
import { admissionsClerkAddsNewPractitioner } from './journey/admissionsClerkAddsNewPractitioner';
import { admissionsClerkAddsPractitionerEmail } from './journey/admissionsClerkAddsPractitionerEmail';
import { admissionsClerkEditsPractitionerInfo } from './journey/admissionsClerkEditsPractitionerInfo';
import { admissionsClerkMigratesPractitionerWithoutEmail } from './journey/admissionsClerkMigratesPractitionerWithoutEmail';
import { admissionsClerkSearchesForPractitionerByBarNumber } from './journey/admissionsClerkSearchesForPractitionerByBarNumber';
import { admissionsClerkSearchesForPractitionersByName } from './journey/admissionsClerkSearchesForPractitionersByName';
import { admissionsClerkVerifiesPractitionerServiceIndicator } from './journey/admissionsClerkVerifiesPractitionerServiceIndicator';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';

const integrationTest = setupTest();

describe('admissions clerk practitioner journey', () => {
  const { COUNTRY_TYPES, PARTY_TYPES, SERVICE_INDICATOR_TYPES } =
    applicationContext.getConstants();

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'admissionsclerk@example.com');
  admissionsClerkAddsNewPractitioner(integrationTest);
  admissionsClerkSearchesForPractitionersByName(integrationTest);
  admissionsClerkSearchesForPractitionerByBarNumber(integrationTest);

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
  petitionsClerkAddsPractitionersToCase(integrationTest, true);

  loginAs(integrationTest, 'admissionsclerk@example.com');
  admissionsClerkEditsPractitionerInfo(integrationTest);

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

  loginAs(integrationTest, 'admissionsclerk@example.com');
  admissionsClerkMigratesPractitionerWithoutEmail(integrationTest);
  admissionsClerkVerifiesPractitionerServiceIndicator(
    integrationTest,
    SERVICE_INDICATOR_TYPES.SI_PAPER,
  );

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(integrationTest);
  petitionsClerkAddsPractitionersToCase(integrationTest, true);

  it('wait for ES index', async () => {
    await refreshElasticsearchIndex();
  });

  loginAs(integrationTest, 'admissionsclerk@example.com');
  admissionsClerkAddsPractitionerEmail(integrationTest);

  // show Practitioners only, and not case-users (bug ref: #8081)
  it('searches for indexed Practitioners only and not CaseUser records', async () => {
    await integrationTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'practitionerSearchByName',
      key: 'practitionerName',
      value: 'Buch',
    });

    await integrationTest.runSequence('submitPractitionerNameSearchSequence');

    expect(
      integrationTest.getState(
        `searchResults.${ADVANCED_SEARCH_TABS.PRACTITIONER}.0.name`,
      ),
    ).toEqual('Ronald Buch Jr.');
  });
});
