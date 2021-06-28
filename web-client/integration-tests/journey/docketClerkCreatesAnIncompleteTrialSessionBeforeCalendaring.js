import { TRIAL_SESSION_PROCEEDING_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { TrialSession } from '../../../shared/src/business/entities/trialSessions/TrialSession';

const errorMessages = TrialSession.VALIDATION_ERROR_MESSAGES;

export const docketClerkCreatesAnIncompleteTrialSessionBeforeCalendaring = (
  integrationTest,
  overrides = {},
) => {
  return it('Docket clerk starts a trial session before calendaring', async () => {
    await integrationTest.runSequence('gotoAddTrialSessionSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('submitTrialSessionSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      maxCases: errorMessages.maxCases,
      sessionType: errorMessages.sessionType,
      startDate: errorMessages.startDate[1],
      term: errorMessages.term,
      termYear: errorMessages.termYear,
      trialLocation: errorMessages.trialLocation,
    });

    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'proceedingType',
      value: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    });

    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'maxCases',
      value: overrides.maxCases || 100,
    });

    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'sessionType',
      value: overrides.sessionType || 'Hybrid',
    });

    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'month',
      value: '8',
    });

    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'day',
      value: '12',
    });

    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'year',
      value: '2025',
    });

    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'month',
      value: '12',
    });

    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'trialLocation',
      value: overrides.trialLocation || 'Seattle, Washington',
    });

    await integrationTest.runSequence('validateTrialSessionSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('submitTrialSessionSequence');

    expect(integrationTest.getState('alertSuccess')).toEqual({
      message: 'Trial session added.',
    });

    const lastCreatedTrialSessionId = integrationTest.getState(
      'lastCreatedTrialSessionId',
    );
    expect(lastCreatedTrialSessionId).toBeDefined();

    integrationTest.lastCreatedTrialSessionId = lastCreatedTrialSessionId;
  });
};
