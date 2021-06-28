import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkManuallyAddsCaseToCalendaredTrialSession } from './journey/petitionsClerkManuallyAddsCaseToCalendaredTrialSession';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';

const integrationTest = setupTest();

let caseDetail;

describe('Trial session migration journey', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  const trialLocation = 'Memphis, Tennessee';

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  beforeEach(async () => {
    await refreshElasticsearchIndex();
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  it('should use migrated trial session from seed data', async () => {
    // from web-api/storage/fixtures/seed/integration-test-data/migrated-trial-session.json
    integrationTest.trialSessionId = '959c4338-0fac-42eb-b0eb-d53b8d0195fb';
  });

  it('should create a new case and calendar it', async () => {
    caseDetail = await uploadPetition(integrationTest, {
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
      preferredTrialCity: 'Memphis, Tennessee',
    });
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
    integrationTest.createdCases = [integrationTest.docketNumber];
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkSubmitsCaseToIrs(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkSetsCaseReadyForTrial(integrationTest);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkManuallyAddsCaseToCalendaredTrialSession(integrationTest, 0);

  it('Docketclerk views migrated, calendared case with migrated trial session', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: caseDetail.docketNumber,
    });
    caseDetail = integrationTest.getState('caseDetail');
    expect(integrationTest.getState('caseDetail.trialSessionId')).toBeDefined();
    expect(integrationTest.getState('caseDetail.trialLocation')).toEqual(
      trialLocation,
    );
  });
});
