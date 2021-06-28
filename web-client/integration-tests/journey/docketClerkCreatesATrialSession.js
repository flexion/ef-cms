import { TRIAL_SESSION_PROCEEDING_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { TrialSession } from '../../../shared/src/business/entities/trialSessions/TrialSession';

const errorMessages = TrialSession.VALIDATION_ERROR_MESSAGES;

export const docketClerkCreatesATrialSession = (
  integrationTest,
  overrides = {},
) => {
  return it('Docket clerk starts a trial session', async () => {
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
      value: '13',
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
      key: 'address1',
      value: '123 Flavor Ave',
    });

    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'city',
      value: 'Seattle',
    });

    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'state',
      value: 'WA',
    });

    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'postalCode',
      value: '98101',
    });

    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'judge',
      value: overrides.judge || {
        name: 'Cohen',
        userId: 'dabbad04-18d0-43ec-bafb-654e83405416',
      },
    });

    if (overrides.trialClerk) {
      await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
        key: 'trialClerk',
        value: overrides.trialClerk,
      });
    }

    await integrationTest.runSequence('validateTrialSessionSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      startDate: errorMessages.startDate[1],
      term: errorMessages.term,
      trialLocation: errorMessages.trialLocation,
    });

    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'month',
      value: '12',
    });

    await integrationTest.runSequence('validateTrialSessionSequence');

    expect(integrationTest.getState('form.term')).toEqual('Fall');
    expect(integrationTest.getState('form.termYear')).toEqual('2025');

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
