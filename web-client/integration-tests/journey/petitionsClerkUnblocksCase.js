import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerkUnblocksCase = (
  integrationTest,
  trialLocation,
  checkReport = true,
) => {
  return it('Petitions clerk unblocks the case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('caseDetail').blocked).toBeTruthy();

    await integrationTest.runSequence('unblockCaseFromTrialSequence');

    expect(integrationTest.getState('alertSuccess').message).toEqual(
      'Block removed. Case is eligible for next available trial session.',
    );
    expect(integrationTest.getState('caseDetail').blocked).toBeFalsy();
    expect(
      integrationTest.getState('caseDetail').blockedReason,
    ).toBeUndefined();

    if (checkReport) {
      await refreshElasticsearchIndex();

      await integrationTest.runSequence('gotoBlockedCasesReportSequence');

      await integrationTest.runSequence(
        'getBlockedCasesByTrialLocationSequence',
        {
          key: 'trialLocation',
          value: trialLocation,
        },
      );

      expect(integrationTest.getState('blockedCases')).toMatchObject([]);
    }
  });
};
