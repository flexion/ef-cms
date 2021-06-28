import { SERVICE_INDICATOR_TYPES } from '../../shared/src/business/entities/EntityConstants';
import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  setupTest,
} from './helpers';
import { formattedCaseDetail } from '../src/presenter/computeds/formattedCaseDetail';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkSubmitsPaperCaseToIrs } from './journey/petitionsClerkSubmitsPaperCaseToIrs';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const integrationTest = setupTest();
integrationTest.draftOrders = [];

describe('Petitioner Service Indicator Journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(integrationTest, fakeFile);
  petitionsClerkSubmitsPaperCaseToIrs(integrationTest);

  // verify it is paper

  loginAs(integrationTest, 'docketclerk@example.com');
  it('Docket Clerk verifies petitioner service indicator is paper', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: integrationTest.getState(),
      },
    );

    const contactPrimary = caseDetailFormatted.petitioners[0];

    expect(contactPrimary.serviceIndicator).toEqual('Paper');
  });

  loginAs(integrationTest, 'admissionsclerk@example.com');
  it('Admissions Clerk updates petitioner email address', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const contactPrimary = contactPrimaryFromState(integrationTest);

    await integrationTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactPrimary.contactId,
        docketNumber: integrationTest.docketNumber,
      },
    );

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.updatedEmail',
      value: 'petitioner@example.com',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.confirmEmail',
      value: 'petitioner@example.com',
    });

    await integrationTest.runSequence('submitEditPetitionerSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('modal.showModal')).toEqual(
      'MatchingEmailFoundModal',
    );

    await integrationTest.runSequence(
      'submitUpdatePetitionerInformationFromModalSequence',
    );

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    expect(integrationTest.getState('alertSuccess.message')).toEqual(
      'Changes saved.',
    );
  });

  // verify it is electronic

  loginAs(integrationTest, 'docketclerk@example.com');
  it('Docket Clerk verifies petitioner service indicator is now electronic', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    const contactPrimary = contactPrimaryFromState(integrationTest);
    expect(contactPrimary.serviceIndicator).toEqual('Electronic');
  });

  loginAs(integrationTest, 'irsPractitioner@example.com');
  it('IRS Practitioner verifies service indicator is electronic', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');

    const contactPrimary = contactPrimaryFromState(integrationTest);
    expect(contactPrimary.serviceIndicator).toEqual('Electronic');
  });

  // seal address
  loginAs(integrationTest, 'docketclerk@example.com');
  it('Docket Clerk seals address and verifies petitioner service indicator is electronic', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    let contactPrimary = contactPrimaryFromState(integrationTest);

    await integrationTest.runSequence('openSealAddressModalSequence', {
      contactToSeal: contactPrimary,
    });

    expect(integrationTest.getState('modal.showModal')).toEqual(
      'SealAddressModal',
    );

    await integrationTest.runSequence('sealAddressSequence');
    expect(integrationTest.getState('alertSuccess.message')).toContain(
      'Address sealed for',
    );

    contactPrimary = contactPrimaryFromState(integrationTest);
    expect(contactPrimary.serviceIndicator).toEqual('Electronic');
  });

  loginAs(integrationTest, 'irsPractitioner@example.com');
  it('IRS Practitioner verifies service indicator for contact is electronic, with sealed address', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');

    const contactPrimary = contactPrimaryFromState(integrationTest);
    expect(contactPrimary.serviceIndicator).toEqual('Electronic');
  });

  // add private practitioner
  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(integrationTest, true);

  // verify None for docket clerk
  // verify None for irsPractitioner

  loginAs(integrationTest, 'docketclerk@example.com');
  it('Docket Clerk verifies petitioner service indicator shows none, with sealed address', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    const contactPrimary = contactPrimaryFromState(integrationTest);
    expect(contactPrimary.serviceIndicator).toEqual('None');
  });

  loginAs(integrationTest, 'irsPractitioner1@example.com'); // unassociated practitioner
  it('IRS Practitioner verifies service indicator for contact shows none with sealed address', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');

    const contactPrimary = contactPrimaryFromState(integrationTest);
    expect(contactPrimary.serviceIndicator).toEqual('None');
  });

  // explicitly set petitioner to Paper
  loginAs(integrationTest, 'docketclerk@example.com');
  it('Updates petitioner service indicator to paper', async () => {
    const contactToEdit = contactPrimaryFromState(integrationTest);

    await integrationTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactToEdit.contactId,
        docketNumber: integrationTest.docketNumber,
      },
    );

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.serviceIndicator',
      value: 'Paper',
    });

    await integrationTest.runSequence('submitEditPetitionerSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    expect(integrationTest.getState('alertSuccess.message')).toEqual(
      'Changes saved.',
    );

    const contactPrimary = contactPrimaryFromState(integrationTest);
    expect(contactPrimary.serviceIndicator).toEqual('Paper');
  });

  // verify Paper for irsPractitioner
  loginAs(integrationTest, 'irsPractitioner@example.com');
  it('IRS Practitioner verifies service indicator for contact is paper, with sealed address', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');

    const contactPrimary = contactPrimaryFromState(integrationTest);
    expect(contactPrimary.serviceIndicator).toEqual('Paper');
  });

  // explicitly set petitioner to Paper
  loginAs(integrationTest, 'docketclerk@example.com');
  it('Updates petitioner service indicator to none', async () => {
    let contactPrimary = contactPrimaryFromState(integrationTest);

    await integrationTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contactPrimary.contactId,
        docketNumber: integrationTest.docketNumber,
      },
    );

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.serviceIndicator',
      value: 'None',
    });

    await integrationTest.runSequence('submitEditPetitionerSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    expect(integrationTest.getState('alertSuccess.message')).toEqual(
      'Changes saved.',
    );

    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: integrationTest.getState(),
      },
    );

    contactPrimary = caseDetailFormatted.petitioners[0];
    expect(contactPrimary.serviceIndicator).toEqual('None');
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  it('Removes private practitioner from case and check service indicator is electronic when contact has an email', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const barNumber = integrationTest.getState(
      'caseDetail.privatePractitioners.0.barNumber',
    );

    await integrationTest.runSequence('gotoEditPetitionerCounselSequence', {
      barNumber,
      docketNumber: integrationTest.docketNumber,
    });

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

    expect(integrationTest.getState('validationErrors')).toEqual({});

    const contactPrimary = contactPrimaryFromState(integrationTest);
    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
    expect(contactPrimary.email).toBeDefined();
  });

  loginAs(integrationTest, 'irsPractitioner@example.com');
  it('IRS Practitioner verifies service indicator for contact is electronic, with sealed address', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');

    const contactPrimary = contactPrimaryFromState(integrationTest);
    expect(contactPrimary.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );
  });
});
