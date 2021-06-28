import { contactPrimaryFromState, refreshElasticsearchIndex } from '../helpers';
import { headerHelper as headerHelperComputed } from '../../src/presenter/computeds/headerHelper';

import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const headerHelper = withAppContextDecorator(headerHelperComputed);

export const userLogsInAndChecksVerifiedEmailAddress = (
  integrationTest,
  user,
  mockUpdatedEmail,
) =>
  it(`${user} logs in and checks verified email address of ${mockUpdatedEmail}`, async () => {
    const userFromState = integrationTest.getState('user');

    expect(userFromState.email).toEqual(mockUpdatedEmail);

    const header = runCompute(headerHelper, {
      state: integrationTest.getState(),
    });

    expect(header.showVerifyEmailWarningNotification).toBeFalsy();

    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    if (user === 'petitioner') {
      const contactPrimary = contactPrimaryFromState(integrationTest);
      const petitionerEmail = contactPrimary.email;

      expect(petitionerEmail).toEqual(mockUpdatedEmail);
    } else {
      const privatePractitioners = integrationTest.getState(
        'caseDetail.privatePractitioners',
      );
      const privatePractitioner = privatePractitioners.find(
        practitioner => practitioner.userId === userFromState.userId,
      );

      expect(privatePractitioner.email).toEqual(mockUpdatedEmail);
    }
  });
