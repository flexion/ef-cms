import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkEditsServiceIndicatorForPractitioner =
  integrationTest => {
    return it('docket clerk edits service indicator for a practitioner', async () => {
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

      expect(integrationTest.getState('validationErrors')).toEqual({});
      expect(integrationTest.getState('currentPage')).toEqual(
        'EditPetitionerCounsel',
      );

      expect(integrationTest.getState('form.serviceIndicator')).toEqual(
        SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      );

      await integrationTest.runSequence('updateFormValueSequence', {
        key: 'serviceIndicator',
        value: SERVICE_INDICATOR_TYPES.SI_PAPER,
      });

      expect(
        integrationTest.getState(
          'caseDetail.privatePractitioners.0.serviceIndicator',
        ),
      ).toEqual(SERVICE_INDICATOR_TYPES.SI_ELECTRONIC);

      await integrationTest.runSequence('submitEditPetitionerCounselSequence');

      expect(
        integrationTest.getState(
          'caseDetail.privatePractitioners.0.serviceIndicator',
        ),
      ).toEqual(SERVICE_INDICATOR_TYPES.SI_PAPER);
    });
  };
