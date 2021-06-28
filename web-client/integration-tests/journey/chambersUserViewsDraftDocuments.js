import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const chambersUserViewsDraftDocuments = (integrationTest, count = 0) => {
  return it('Chambers user views draft documents', async () => {
    integrationTest.setState('caseDetail', {});

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const formatted = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    expect(formatted.draftDocuments.length).toEqual(count);
  });
};
