import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
} from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const integrationTest = setupTest();

describe('admissions clerk adds petitioner with existing cognito account to case', () => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

  const EMAIL_TO_ADD = 'petitioner2@example.com';

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(integrationTest, fakeFile);
  petitionsClerkAddsPractitionersToCase(integrationTest, true);

  loginAs(integrationTest, 'admissionsclerk@example.com');
  it('admissions clerk adds petitioner email with existing cognito account to case', async () => {
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
      'MatchingEmailFoundModal',
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

    expect(contactPrimary.email).toEqual(EMAIL_TO_ADD);
    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );

    await refreshElasticsearchIndex();
  });

  loginAs(integrationTest, 'petitioner2@example.com');
  it('petitioner with existing account verifies case is added to dashboard', async () => {
    await integrationTest.runSequence('gotoDashboardSequence');

    expect(integrationTest.getState('currentPage')).toEqual(
      'DashboardPetitioner',
    );
    const openCases = integrationTest.getState('openCases');

    const addedCase = openCases.find(
      c => c.docketNumber === integrationTest.docketNumber,
    );
    expect(addedCase).toBeDefined();

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');
    expect(integrationTest.getState('screenMetadata.isAssociated')).toEqual(
      true,
    );
  });

  it('should verify that practitioner representing contactId matches contactPrimary contactId after email is updated', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(integrationTest);

    const practitionerRepresenting = integrationTest.getState(
      'caseDetail.privatePractitioners.0.representing',
    );

    expect(practitionerRepresenting).toEqual([contactPrimary.contactId]);
  });
});
