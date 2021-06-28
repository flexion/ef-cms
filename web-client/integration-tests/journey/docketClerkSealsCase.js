import { refreshElasticsearchIndex } from '../helpers';

export const docketClerkSealsCase = integrationTest => {
  return it('Docketclerk seals a case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('caseDetail.sealedDate')).toBeUndefined();

    await integrationTest.runSequence('sealCaseSequence');

    expect(integrationTest.getState('caseDetail.sealedDate')).toBeDefined();
    expect(integrationTest.getState('caseDetail.isSealed')).toBeTruthy();

    await refreshElasticsearchIndex();
  });
};
