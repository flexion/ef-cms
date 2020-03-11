import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/cases/CaseConstants';

export const docketClerkEditsServiceIndicatorForPractitioner = test => {
  return it('docket clerk edits service indicator for a practitioner', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openEditPractitionersModalSequence');

    expect(
      test.getState('modal.privatePractitioners.0.serviceIndicator'),
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_ELECTRONIC);

    await test.runSequence('updateModalValueSequence', {
      key: 'privatePractitioners.0.serviceIndicator',
      value: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });

    expect(
      test.getState('caseDetail.privatePractitioners.0.serviceIndicator'),
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_ELECTRONIC);

    await test.runSequence('submitEditPractitionersModalSequence');

    expect(
      test.getState('caseDetail.privatePractitioners.0.serviceIndicator'),
    ).toEqual(SERVICE_INDICATOR_TYPES.SI_PAPER);
  });
};
