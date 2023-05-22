import {
  COUNTRY_TYPES,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { admissionsClerkAddsPractitionerEmail } from './journey/admissionsClerkAddsPractitionerEmail';
import { admissionsClerkMigratesPractitionerWithoutEmail } from './journey/admissionsClerkMigratesPractitionerWithoutEmail';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { partiesInformationHelper as partiesInformationHelperComputed } from '../src/presenter/computeds/partiesInformationHelper';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { practitionerRequestsAccessToCase } from './journey/practitionerRequestsAccessToCase';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

describe('private practitioner views pending email journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const { docketNumber } = await uploadPetition(cerebralTest, {
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

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  admissionsClerkMigratesPractitionerWithoutEmail(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(cerebralTest, true);

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  admissionsClerkAddsPractitionerEmail(cerebralTest);

  it('admission clerk views pending email for counsel on case', () => {
    const partiesInformationHelper = withAppContextDecorator(
      partiesInformationHelperComputed,
    );

    const partiesHelper = runCompute(partiesInformationHelper, {
      state: cerebralTest.getState(),
    });

    const practitionerWithPendingEmail =
      partiesHelper.formattedPetitioners[0].representingPractitioners.find(
        prac => prac.barNumber === cerebralTest.barNumber,
      );

    expect(practitionerWithPendingEmail.formattedPendingEmail).toBe(
      `${cerebralTest.pendingEmail} (Pending)`,
    );
  });

  loginAs(cerebralTest, 'privatepractitioner@example.com');
  practitionerRequestsAccessToCase(cerebralTest);

  it('unassociated private practitioner views pending email for counsel on case', () => {
    const partiesInformationHelper = withAppContextDecorator(
      partiesInformationHelperComputed,
    );

    const partiesHelper = runCompute(partiesInformationHelper, {
      state: cerebralTest.getState(),
    });

    const practitionerWithPendingEmail =
      partiesHelper.formattedPetitioners[0].representingPractitioners.find(
        prac => prac.barNumber === cerebralTest.barNumber,
      );

    expect(practitionerWithPendingEmail.formattedPendingEmail).toBe(
      `${cerebralTest.pendingEmail} (Pending)`,
    );
  });
});
