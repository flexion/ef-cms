import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);

export const petitionsClerkDeletesCaseDeadline = integrationTest => {
  return it('Petitions clerk deletes a case deadline', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const helper = runCompute(caseDetailHelper, {
      state: integrationTest.getState(),
    });

    await integrationTest.runSequence('openDeleteCaseDeadlineModalSequence', {
      caseDeadlineId: helper.caseDeadlines[0].caseDeadlineId,
    });

    expect(integrationTest.getState('form.caseDeadlineId')).toBeTruthy();
    expect(integrationTest.getState('form.month')).toBeTruthy();
    expect(integrationTest.getState('form.day')).toBeTruthy();
    expect(integrationTest.getState('form.year')).toBeTruthy();
    expect(integrationTest.getState('form.description')).toBeTruthy();

    await integrationTest.runSequence('deleteCaseDeadlineSequence');
  });
};
