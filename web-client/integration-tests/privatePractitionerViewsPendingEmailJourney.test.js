import {
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { admissionsClerkAddsPractitionerEmail } from './journey/admissionsClerkAddsPractitionerEmail';
import { admissionsClerkMigratesPractitionerWithoutEmail } from './journey/admissionsClerkMigratesPractitionerWithoutEmail';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { partiesInformationHelper as partiesInformationHelperComputed } from '../src/presenter/computeds/partiesInformationHelper';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { practitionerRequestsAccessToCase } from './journey/practitionerRequestsAccessToCase';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const integrationTest = setupTest();

describe('private practitioner views pending email journey', () => {
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
  petitionsClerkServesElectronicCaseToIrs(integrationTest);

  loginAs(integrationTest, 'admissionsclerk@example.com');
  admissionsClerkMigratesPractitionerWithoutEmail(integrationTest);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(integrationTest, true);

  loginAs(integrationTest, 'admissionsclerk@example.com');
  admissionsClerkAddsPractitionerEmail(integrationTest);

  it('admission clerk views pending email for counsel on case', () => {
    const partiesInformationHelper = withAppContextDecorator(
      partiesInformationHelperComputed,
    );

    const partiesHelper = runCompute(partiesInformationHelper, {
      state: integrationTest.getState(),
    });

    const practitionerWithPendingEmail =
      partiesHelper.formattedPetitioners[0].representingPractitioners.find(
        prac => prac.barNumber === integrationTest.barNumber,
      );

    expect(practitionerWithPendingEmail.formattedPendingEmail).toBe(
      `${integrationTest.pendingEmail} (Pending)`,
    );
  });

  loginAs(integrationTest, 'privatePractitioner@example.com');
  practitionerRequestsAccessToCase(integrationTest, fakeFile);

  it('unassociated private practitioner views pending email for counsel on case', () => {
    const partiesInformationHelper = withAppContextDecorator(
      partiesInformationHelperComputed,
    );

    const partiesHelper = runCompute(partiesInformationHelper, {
      state: integrationTest.getState(),
    });

    const practitionerWithPendingEmail =
      partiesHelper.formattedPetitioners[0].representingPractitioners.find(
        prac => prac.barNumber === integrationTest.barNumber,
      );

    expect(practitionerWithPendingEmail.formattedPendingEmail).toBe(
      `${integrationTest.pendingEmail} (Pending)`,
    );
  });
});
