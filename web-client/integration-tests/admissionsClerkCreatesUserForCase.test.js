import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  setupTest,
} from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import faker from 'faker';

const integrationTest = setupTest();

const validEmail = `${faker.internet.userName()}_no_error@example.com`;

describe('admissions clerk creates user for case', () => {
  let petitionerContactId;

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(integrationTest, fakeFile);

  loginAs(integrationTest, 'admissionsclerk@example.com');
  it('admissions clerk verifies petitioner on case has no email', async () => {
    const contactPrimary = contactPrimaryFromState(integrationTest);
    petitionerContactId = contactPrimary.contactId;

    await integrationTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactPrimary.contactId,
        docketNumber: integrationTest.docketNumber,
      },
    );

    expect(contactPrimary.email).toBeUndefined();

    expect(integrationTest.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );

    expect(
      integrationTest.getState('form.contact.updatedEmail'),
    ).toBeUndefined();
    expect(integrationTest.getState('form.contact.serviceIndicator')).toBe(
      'Paper',
    );
  });

  it('admissions clerk adds an existing email address for petitioner on case', async () => {
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.updatedEmail',
      value: 'petitioner@example.com',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: 'petitioner@example.com',
    });

    await integrationTest.runSequence('submitEditPetitionerSequence');

    expect(integrationTest.getState('modal.showModal')).toBe(
      'MatchingEmailFoundModal',
    );

    await integrationTest.runSequence('dismissModalSequence');

    expect(integrationTest.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );
  });

  it('admissions clerk adds a new email address for petitioner on case', async () => {
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.updatedEmail',
      value: validEmail,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: validEmail,
    });

    await integrationTest.runSequence('submitEditPetitionerSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('modal.showModal')).toBe(
      'NoMatchingEmailFoundModal',
    );

    await integrationTest.runSequence(
      'submitUpdatePetitionerInformationFromModalSequence',
    );

    expect(integrationTest.getState('modal.showModal')).toBeUndefined();
  });

  it('admissions clerk checks pending email for petitioner on case with unverified email', async () => {
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    expect(integrationTest.getState('screenMetadata.pendingEmails')).toEqual({
      [petitionerContactId]: validEmail,
    });
  });
});
