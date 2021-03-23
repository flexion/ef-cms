import { fakeFile, loginAs, setupTest } from './helpers';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';
import faker from 'faker';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

const test = setupTest();

const validEmail = `${faker.internet.userName()}_no_error@example.com`;

describe('admissions clerk creates user for case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(test, fakeFile);

  loginAs(test, 'admissionsclerk@example.com');
  it('admissions clerk verifies petitioner on case has no email', async () => {
    await test.runSequence('gotoEditPetitionerInformationSequence', {
      docketNumber: test.docketNumber,
    });

    const formattedCase = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formattedCase.contactPrimary.email).toBeUndefined();

    await test.runSequence('gotoEditPetitionerInformationSequence');
    expect(test.getState('currentPage')).toEqual('EditPetitionerInformation');

    expect(test.getState('form.contactPrimary,email')).toBeUndefined();
    expect(test.getState('form.contactPrimary.serviceIndicator')).toBe('Paper');
  });

  it('admissions clerk adds an existing email address for petitioner on case', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.email',
      value: 'petitioner@example.com',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.confirmEmail',
      value: 'petitioner@example.com',
    });

    await test.runSequence('updatePetitionerInformationFormSequence');

    expect(test.getState('modal.showModal')).toBe('MatchingEmailFoundModal');

    await test.runSequence('dismissModalSequence');

    expect(test.getState('currentPage')).toEqual('EditPetitionerInformation');
  });

  it('admissions clerk adds a new email address for petitioner on case', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.email',
      value: validEmail,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.confirmEmail',
      value: validEmail,
    });

    await test.runSequence('updatePetitionerInformationFormSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('modal.showModal')).toBe('NoMatchingEmailFoundModal');

    await test.runSequence(
      'submitUpdatePetitionerInformationFromModalSequence',
    );

    expect(test.getState('modal.showModal')).toBeUndefined();
  });

  it('admissions clerk checks pending email for petitioner on case with unverified email', async () => {
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    expect(test.getState('screenMetadata.userPendingEmail')).toBe(validEmail);
  });
});
