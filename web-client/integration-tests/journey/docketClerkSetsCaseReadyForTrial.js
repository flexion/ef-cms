const {
  CASE_STATUS_TYPES,
} = require('../../../shared/src/business/entities/EntityConstants');

export const docketClerkSetsCaseReadyForTrial = integrationTest => {
  return it('Docket clerk sets a case ready for trial', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('caseDetail.docketNumber')).toEqual(
      integrationTest.docketNumber,
    );
    expect(integrationTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.generalDocket,
    );

    await integrationTest.runSequence('openUpdateCaseModalSequence');

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'caseStatus',
      value: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    });

    await integrationTest.runSequence('submitUpdateCaseModalSequence');

    expect(integrationTest.getState('caseDetail.docketNumber')).toEqual(
      integrationTest.docketNumber,
    );
    expect(integrationTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.generalDocketReadyForTrial,
    );

    if (integrationTest.casesReadyForTrial) {
      integrationTest.casesReadyForTrial.push(
        integrationTest.getState('caseDetail'),
      );
    }
  });
};
