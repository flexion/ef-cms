import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { refreshElasticsearchIndex } from '../helpers';

const { DOCKET_NUMBER_SUFFIXES, STATUS_TYPES } =
  applicationContext.getConstants();

export const petitionsClerkBlocksCase = (
  integrationTest,
  trialLocation,
  overrides = {},
) => {
  return it('Petitions clerk blocks the case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('caseDetail').blocked).toBeFalsy();

    await integrationTest.runSequence('blockCaseFromTrialSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      reason: 'Provide a reason',
    });

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'reason',
      value: 'just because',
    });

    await integrationTest.runSequence('blockCaseFromTrialSequence');

    expect(integrationTest.getState('alertSuccess').message).toEqual(
      'Case blocked from being set for trial.',
    );
    expect(integrationTest.getState('caseDetail').blocked).toBeTruthy();
    expect(integrationTest.getState('caseDetail').blockedReason).toEqual(
      'just because',
    );

    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoBlockedCasesReportSequence');

    await integrationTest.runSequence(
      'getBlockedCasesByTrialLocationSequence',
      {
        key: 'trialLocation',
        value: trialLocation,
      },
    );

    expect(integrationTest.getState('blockedCases')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          blocked: true,
          blockedDate: expect.anything(),
          blockedReason: 'just because',
          caseCaption:
            overrides.caseCaption ||
            'Daenerys Stormborn, Deceased, Daenerys Stormborn, Surviving Spouse, Petitioner',
          docketNumber: integrationTest.docketNumber,
          docketNumberSuffix:
            overrides.docketNumberSuffix || DOCKET_NUMBER_SUFFIXES.SMALL,
          status:
            overrides.caseStatus || STATUS_TYPES.generalDocketReadyForTrial,
        }),
      ]),
    );
  });
};
