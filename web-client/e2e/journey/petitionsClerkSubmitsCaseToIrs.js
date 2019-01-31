export default test => {
  return it('Petitions clerk submits case to IRS holding queue', async () => {
    await test.runSequence('toggleShowModalSequence');
    expect(test.getState('showModal')).toEqual(true);

    await test.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2050',
    });
    await test.runSequence('autoSaveCaseSequence');

    await test.runSequence('clickServeToIrsSequence');
    expect(test.getState('caseDetailErrors')).toEqual({
      irsNoticeDate:
        'The IRS notice date is in the future. Please enter a valid date.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'irsYear',
      value: '2017',
    });
    await test.runSequence('autoSaveCaseSequence');

    await test.runSequence('clickServeToIrsSequence');
    expect(test.getState('caseDetailErrors')).toEqual({});

    await test.runSequence('submitPetitionToIRSHoldingQueueSequence');

    //check that save occurred
    expect(test.getState('caseDetail.irsNoticeDate')).toEqual(
      '2017-12-24T00:00:00.000Z',
    );
    expect(test.getState('caseDetail.status')).toEqual('Batched for IRS');
    expect(test.getState('alertSuccess.title')).toEqual(
      'The petition is now in the IRS Holding Queue',
    );
    expect(test.getState('caseDetailErrors')).toEqual({});
  });
};
