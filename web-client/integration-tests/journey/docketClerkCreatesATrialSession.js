export default (test, overrides = {}) => {
  return it('Docket clerk starts a trial session', async () => {
    await test.runSequence('gotoAddTrialSessionSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitTrialSessionSequence');

    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'maxCases',
      'sessionType',
      'startDate',
      'term',
      'termYear',
      'trialLocation',
    ]);

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'maxCases',
      value: overrides.maxCases || 100,
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'sessionType',
      value: overrides.sessionType || 'Hybrid',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'month',
      value: '8',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'day',
      value: '12',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'year',
      value: '2025',
    });

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'judge',
      value: overrides.judge || 'Judge Cohen',
    });

    await test.runSequence('validateTrialSessionSequence');

    expect(Object.keys(test.getState('validationErrors')).sort()).toEqual([
      'startDate',
      'term',
      'trialLocation',
    ]);
    expect(test.getState('validationErrors').startDate).toEqual(
      'Term session is not valid.',
    );
    expect(test.getState('validationErrors').term).toEqual(
      'Term session is not valid.',
    );

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'month',
      value: '12',
    });

    await test.runSequence('validateTrialSessionSequence');

    expect(test.getState('form.term')).toEqual('Fall');
    expect(test.getState('form.termYear')).toEqual('2025');

    await test.runSequence('updateTrialSessionFormDataSequence', {
      key: 'trialLocation',
      value: overrides.trialLocation || 'Seattle, Washington',
    });

    await test.runSequence('validateTrialSessionSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('submitTrialSessionSequence');
  });
};
