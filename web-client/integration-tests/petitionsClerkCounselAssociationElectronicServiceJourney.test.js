import { SERVICE_INDICATOR_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  callCognitoTriggerForPendingEmail,
  contactPrimaryFromState,
  contactSecondaryFromState,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

const integrationTest = setupTest();
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

describe('Petitions Clerk Counsel Association Journey', () => {
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
        name: 'Test Petitioner 2',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
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
  it('admissions clerk adds secondary petitioner email with existing cognito account to case', async () => {
    await refreshElasticsearchIndex();

    let contactSecondary = contactSecondaryFromState(integrationTest);

    await integrationTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactSecondary.contactId,
        docketNumber: integrationTest.docketNumber,
      },
    );

    expect(contactSecondary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    expect(integrationTest.getState('currentPage')).toEqual(
      'EditPetitionerInformationInternal',
    );
    expect(integrationTest.getState('form.updatedEmail')).toBeUndefined();
    expect(integrationTest.getState('form.confirmEmail')).toBeUndefined();

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.updatedEmail',
      value: 'petitioner2@example.com',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: 'petitioner2@example.com',
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

    contactSecondary = contactSecondaryFromState(integrationTest);

    expect(contactSecondary.email).toEqual('petitioner2@example.com');
    expect(contactSecondary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );

    await refreshElasticsearchIndex();
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');

  it('Petitions clerk manually adds a privatePractitioner to case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const practitionerBarNumber = 'PT1234';

    expect(integrationTest.getState('caseDetail.privatePractitioners')).toEqual(
      [],
    );

    await integrationTest.runSequence(
      'openAddPrivatePractitionerModalSequence',
    );

    expect(
      integrationTest.getState('validationErrors.practitionerSearchError'),
    ).toBeDefined();

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'practitionerSearch',
      value: practitionerBarNumber,
    });

    await integrationTest.runSequence(
      'openAddPrivatePractitionerModalSequence',
    );

    expect(
      integrationTest.getState('validationErrors.practitionerSearchError'),
    ).toBeUndefined();
    expect(
      integrationTest.getState('modal.practitionerMatches.length'),
    ).toEqual(1);

    let practitionerMatch = integrationTest.getState(
      'modal.practitionerMatches.0',
    );
    expect(integrationTest.getState('modal.user.userId')).toEqual(
      practitionerMatch.userId,
    );

    const contactPrimary = contactPrimaryFromState(integrationTest);
    const contactSecondary = contactSecondaryFromState(integrationTest);
    await integrationTest.runSequence('updateModalValueSequence', {
      key: `representingMap.${contactPrimary.contactId}`,
      value: true,
    });
    await integrationTest.runSequence('updateModalValueSequence', {
      key: `representingMap.${contactSecondary.contactId}`,
      value: true,
    });

    expect(
      integrationTest.getState('validationErrors.practitionerSearchError'),
    ).toBeUndefined();

    await integrationTest.runSequence(
      'associatePrivatePractitionerWithCaseSequence',
    );

    expect(
      integrationTest.getState('caseDetail.privatePractitioners.length'),
    ).toEqual(1);
    expect(
      integrationTest.getState(
        'caseDetail.privatePractitioners.0.representing',
      ),
    ).toEqual([contactPrimary.contactId, contactSecondary.contactId]);
    expect(
      integrationTest.getState('caseDetail.privatePractitioners.0.name'),
    ).toEqual(practitionerMatch.name);

    let formatted = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    expect(formatted.privatePractitioners.length).toEqual(1);
    expect(formatted.privatePractitioners[0].formattedName).toEqual(
      `${practitionerMatch.name} (${practitionerMatch.barNumber})`,
    );

    await refreshElasticsearchIndex();
  });

  loginAs(integrationTest, 'admissionsclerk@example.com');
  it('Admissions Clerk updates petitioner email address', async () => {
    const NEW_EMAIL = `new${Math.random()}@example.com`;

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(integrationTest);
    integrationTest.contactPrimaryId = contactPrimary.contactId;

    await integrationTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactPrimary.contactId,
        docketNumber: integrationTest.docketNumber,
      },
    );

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.updatedEmail',
      value: NEW_EMAIL,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: NEW_EMAIL,
    });

    await integrationTest.runSequence('submitEditPetitionerSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence(
      'submitUpdatePetitionerInformationFromModalSequence',
    );

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    expect(integrationTest.getState('alertSuccess.message')).toEqual(
      'Changes saved.',
    );

    await refreshElasticsearchIndex();
  });

  it('petitioner verifies email via cognito', async () => {
    await callCognitoTriggerForPendingEmail(integrationTest.contactPrimaryId);
  });

  it('admissions clerk verifies petitioner service preference was not updated', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    const contactPrimary = contactPrimaryFromState(integrationTest);

    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_NONE,
    );
  });

  it('Petitions clerk removes a practitioner from a case', async () => {
    expect(
      integrationTest.getState('caseDetail.privatePractitioners').length,
    ).toEqual(1);

    const barNumber = integrationTest.getState(
      'caseDetail.privatePractitioners.0.barNumber',
    );

    await integrationTest.runSequence('gotoEditPetitionerCounselSequence', {
      barNumber,
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('validationErrors')).toEqual({});
    expect(integrationTest.getState('currentPage')).toEqual(
      'EditPetitionerCounsel',
    );

    await integrationTest.runSequence(
      'openRemovePetitionerCounselModalSequence',
    );

    expect(integrationTest.getState('modal.showModal')).toEqual(
      'RemovePetitionerCounselModal',
    );

    await integrationTest.runSequence(
      'removePetitionerCounselFromCaseSequence',
    );

    await refreshElasticsearchIndex();

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(
      integrationTest.getState('caseDetail.privatePractitioners').length,
    ).toEqual(0);
  });

  it('verifies the service indicator for the second petitioner reverts to electronic', async () => {
    const contactSecondary = contactSecondaryFromState(integrationTest);

    expect(contactSecondary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });
});
