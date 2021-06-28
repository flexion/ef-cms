export const docketClerkUpdatesCaseCaption = integrationTest => {
  return it('Docket clerk updates case caption', async () => {
    integrationTest.setState('caseDetail', {});

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('caseDetail.caseCaption')).toEqual(
      'Daenerys Stormborn, Deceased, Daenerys Stormborn 2, Surviving Spouse, Petitioner',
    );

    await integrationTest.runSequence('openUpdateCaseModalSequence');

    const judges = integrationTest.getState('modal.judges');

    const legacyJudge = judges.find(judge => judge.role === 'legacyJudge');
    expect(legacyJudge).toBeFalsy();

    expect(integrationTest.getState('modal.showModal')).toEqual(
      'UpdateCaseModalDialog',
    );

    expect(integrationTest.getState('modal.caseCaption')).toEqual(
      'Daenerys Stormborn, Deceased, Daenerys Stormborn 2, Surviving Spouse, Petitioner',
    );

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'caseCaption',
      value: 'Mark Althavan Andrews',
    });

    await integrationTest.runSequence('clearModalSequence');

    expect(integrationTest.getState('caseDetail.caseCaption')).toEqual(
      'Daenerys Stormborn, Deceased, Daenerys Stormborn 2, Surviving Spouse, Petitioner',
    );
    expect(integrationTest.getState('modal')).toEqual({});

    await integrationTest.runSequence('openUpdateCaseModalSequence');

    expect(integrationTest.getState('modal.showModal')).toEqual(
      'UpdateCaseModalDialog',
    );
    expect(integrationTest.getState('modal.caseCaption')).toEqual(
      'Daenerys Stormborn, Deceased, Daenerys Stormborn 2, Surviving Spouse, Petitioner',
    );

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'caseCaption',
      value: 'Sisqo',
    });

    await integrationTest.runSequence('submitUpdateCaseModalSequence');

    expect(integrationTest.getState('caseDetail.caseCaption')).toEqual('Sisqo');
    expect(integrationTest.getState('modal')).toEqual({});
  });
};
