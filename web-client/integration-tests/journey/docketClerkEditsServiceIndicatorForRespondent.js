import { SERVICE_INDICATOR_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const docketClerkEditsServiceIndicatorForRespondent =
  integrationTest => {
    return it('docket clerk edits service indicator for a respondent', async () => {
      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: integrationTest.docketNumber,
      });

      const barNumber = integrationTest.getState(
        'caseDetail.irsPractitioners.0.barNumber',
      );

      await integrationTest.runSequence('gotoEditRespondentCounselSequence', {
        barNumber,
        docketNumber: integrationTest.docketNumber,
      });

      expect(integrationTest.getState('form.serviceIndicator')).toEqual(
        SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      );

      await integrationTest.runSequence('updateFormValueSequence', {
        key: 'serviceIndicator',
        value: SERVICE_INDICATOR_TYPES.SI_PAPER,
      });

      expect(
        integrationTest.getState(
          'caseDetail.irsPractitioners.0.serviceIndicator',
        ),
      ).toEqual(SERVICE_INDICATOR_TYPES.SI_ELECTRONIC);

      await integrationTest.runSequence('submitEditRespondentCounselSequence');

      expect(
        integrationTest.getState(
          'caseDetail.irsPractitioners.0.serviceIndicator',
        ),
      ).toEqual(SERVICE_INDICATOR_TYPES.SI_PAPER);
    });
  };
