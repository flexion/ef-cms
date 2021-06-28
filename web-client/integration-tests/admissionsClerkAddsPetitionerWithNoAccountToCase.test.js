import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  callCognitoTriggerForPendingEmail,
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
} from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const integrationTest = setupTest();

describe('admissions clerk adds petitioner without existing cognito account to case', () => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

  const EMAIL_TO_ADD = `new${Math.random()}@example.com`;

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(integrationTest, fakeFile);

  loginAs(integrationTest, 'admissionsclerk@example.com');
  it('admissions clerk adds petitioner email without existing cognito account to case', async () => {
    await refreshElasticsearchIndex();

    let contactPrimary = contactPrimaryFromState(integrationTest);

    await integrationTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactPrimary.contactId,
        docketNumber: integrationTest.docketNumber,
      },
    );

    expect(integrationTest.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );
    expect(integrationTest.getState('form.updatedEmail')).toBeUndefined();
    expect(integrationTest.getState('form.confirmEmail')).toBeUndefined();

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.updatedEmail',
      value: EMAIL_TO_ADD,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: EMAIL_TO_ADD,
    });

    await integrationTest.runSequence('submitEditPetitionerSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('modal.showModal')).toBe(
      'NoMatchingEmailFoundModal',
    );
    expect(integrationTest.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );

    await integrationTest.runSequence(
      'submitUpdatePetitionerInformationFromModalSequence',
    );

    expect(integrationTest.getState('modal.showModal')).toBeUndefined();
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    contactPrimary = contactPrimaryFromState(integrationTest);

    expect(contactPrimary.email).toBeUndefined();
    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    integrationTest.userId = contactPrimary.contactId;

    await refreshElasticsearchIndex();
  });

  it('petitioner verifies email via cognito', async () => {
    await callCognitoTriggerForPendingEmail(integrationTest.userId);
  });

  loginAs(integrationTest, 'admissionsclerk@example.com');
  it('admissions clerk verifies petitioner email is no longer pending and service preference was updated to electronic', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    const contactPrimary = contactPrimaryFromState(integrationTest);

    expect(contactPrimary.email).toEqual(EMAIL_TO_ADD);
    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });
});
