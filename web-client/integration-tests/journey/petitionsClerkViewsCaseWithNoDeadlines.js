import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);

export const petitionsClerkViewsCaseWithNoDeadlines = integrationTest => {
  return it('Petitions clerk views case detail', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    expect(integrationTest.getState('caseDetail.docketNumber')).toEqual(
      integrationTest.docketNumber,
    );

    const helper = runCompute(caseDetailHelper, {
      state: integrationTest.getState(),
    });
    expect(helper.caseDeadlines.length).toEqual(0);
  });
};
