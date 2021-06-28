import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerkManuallyAddsCaseToCalendaredTrialSession = (
  integrationTest,
  createdCasesIndex,
) => {
  return it('Petitions clerk manually adds a case to a calendared trial session', async () => {
    const caseToAdd = integrationTest.createdCases[createdCasesIndex];

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: caseToAdd,
    });

    await integrationTest.runSequence('openAddToTrialModalSequence');

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'showAllLocations',
      value: true,
    });

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: integrationTest.trialSessionId,
    });

    await integrationTest.runSequence('addCaseToTrialSessionSequence');
    await refreshElasticsearchIndex();

    expect(integrationTest.getState('caseDetail.trialDate')).toBeDefined();
  });
};
