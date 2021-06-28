import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { practitionerDetailHelper } from '../../src/presenter/computeds/practitionerDetailHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';
import faker from 'faker';

export const admissionsClerkAddsPractitionerEmail = integrationTest => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();
  const mockAddress2 = 'A Place';
  const mockAvailableEmail = `${faker.internet.userName()}@example.com`;

  return it('admissions clerk edits practitioner information', async () => {
    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: integrationTest.barNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'EditPractitionerUser',
    );

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.address2',
      value: mockAddress2,
    });

    await integrationTest.runSequence('submitUpdatePractitionerUserSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(
      integrationTest.getState('practitionerDetail.contact.address2'),
    ).toBe(mockAddress2);

    await integrationTest.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: integrationTest.barNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'EditPractitionerUser',
    );

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'updatedEmail',
      value: mockAvailableEmail,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: mockAvailableEmail,
    });

    let practitionerDetailHelperComputed = runCompute(
      withAppContextDecorator(practitionerDetailHelper),
      {
        state: integrationTest.getState(),
      },
    );

    expect(practitionerDetailHelperComputed.emailFormatted).not.toBe(
      mockAvailableEmail,
    );

    await integrationTest.runSequence('gotoEditPractitionerUserSequence', {
      barNumber: integrationTest.barNumber,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'updatedEmail',
      value: mockAvailableEmail,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: mockAvailableEmail,
    });

    integrationTest.setState('practitionerDetail', {});

    await integrationTest.runSequence('submitUpdatePractitionerUserSequence');

    await refreshElasticsearchIndex();

    expect(integrationTest.getState('validationErrors')).toEqual({});

    practitionerDetailHelperComputed = runCompute(
      withAppContextDecorator(practitionerDetailHelper),
      {
        state: integrationTest.getState(),
      },
    );

    expect(practitionerDetailHelperComputed.emailFormatted).toBeUndefined();

    expect(practitionerDetailHelperComputed.pendingEmailFormatted).toBe(
      `${mockAvailableEmail} (Pending)`,
    );
    expect(practitionerDetailHelperComputed.serviceIndicator).toBe(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    await refreshElasticsearchIndex();

    integrationTest.setState('caseDetail', {});

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    integrationTest.pendingEmail = mockAvailableEmail;
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
  });
};
