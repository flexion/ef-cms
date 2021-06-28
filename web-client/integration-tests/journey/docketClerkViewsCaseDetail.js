import { contactPrimaryFromState } from '../helpers';

export const docketClerkViewsCaseDetail = (
  integrationTest,
  docketNumber = null,
) => {
  return it('Docketclerk views case detail', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: docketNumber || integrationTest.docketNumber,
    });

    const caseDetail = integrationTest.getState('caseDetail');

    expect(caseDetail.associatedJudge).toBeDefined();
    expect(caseDetail.status).toBeDefined();
    expect(contactPrimaryFromState(integrationTest).contactId).toBeDefined();
  });
};
