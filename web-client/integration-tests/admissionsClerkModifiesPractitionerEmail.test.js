import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { userLogsInAndChecksVerifiedEmailAddress } from './journey/userLogsInAndChecksVerifiedEmailAddress';
import { userVerifiesUpdatedEmailAddress } from './journey/userVerifiesUpdatedEmailAddress';
import faker from 'faker';

const integrationTest = setupTest();

describe('admissions clerk practitioner journey', () => {
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    integrationTest.barNumber = 'SC2222'; //privatePractitioner3

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
  petitionsClerkAddsPractitionersToCase(integrationTest, true);

  loginAs(integrationTest, 'admissionsclerk@example.com');

  it('admissions clerk navigates to edit form', async () => {
    await refreshElasticsearchIndex();
    await integrationTest.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: integrationTest.barNumber,
    });
    expect(integrationTest.getState('currentPage')).toEqual(
      'EditPractitionerUser',
    );
  });

  it('admissions clerk updates practitioner email but it already exists', async () => {
    expect(integrationTest.getState('form.pendingEmail')).toBeUndefined();
    expect(integrationTest.getState('form.originalEmail')).toBe(
      'privatePractitioner3@example.com',
    );

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'updatedEmail',
      value: 'privatePractitioner99@example.com',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: 'privatePractitioner99@example.com',
    });

    await integrationTest.runSequence('submitUpdatePractitionerUserSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      email:
        'An account with this email already exists. Enter a new email address.',
    });
  });

  const validEmail = `${faker.internet.userName()}_no_error@example.com`;
  it('admissions clerk updates practitioner email', async () => {
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'updatedEmail',
      value: validEmail,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: validEmail,
    });

    await integrationTest.runSequence('submitUpdatePractitionerUserSequence');

    expect(integrationTest.getState('modal.showModal')).toBe(
      'EmailVerificationModal',
    );
    expect(integrationTest.getState('currentPage')).toEqual(
      'EditPractitionerUser',
    );

    await integrationTest.runSequence(
      'closeVerifyEmailModalAndNavigateToPractitionerDetailSequence',
    );

    expect(integrationTest.getState('modal.showModal')).toBeUndefined();
    expect(integrationTest.getState('currentPage')).toEqual(
      'PractitionerDetail',
    );

    await integrationTest.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: integrationTest.barNumber,
    });

    expect(integrationTest.getState('form.pendingEmail')).toBe(validEmail);
    expect(integrationTest.getState('form.originalEmail')).toBe(
      'privatePractitioner3@example.com',
    );
    expect(integrationTest.getState('form.updatedEmail')).toBeUndefined();
    expect(integrationTest.getState('form.confirmEmail')).toBeUndefined();
  });

  describe('private practitioner logs in and verifies email address', () => {
    loginAs(integrationTest, 'privatePractitioner3@example.com');
    userVerifiesUpdatedEmailAddress(integrationTest, 'practitioner');

    loginAs(integrationTest, 'privatePractitioner3@example.com');
    userLogsInAndChecksVerifiedEmailAddress(
      integrationTest,
      'practitioner',
      validEmail,
    );
  });
});
