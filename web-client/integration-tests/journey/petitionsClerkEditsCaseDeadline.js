import { CaseDeadline } from '../../../shared/src/business/entities/CaseDeadline';
import { caseDetailHelper as caseDetailHelperComputed } from '../../src/presenter/computeds/caseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed);

const { VALIDATION_ERROR_MESSAGES } = CaseDeadline;

export const petitionsClerkEditsCaseDeadline = (
  integrationTest,
  overrides = {},
) => {
  return it('Petitions clerk edits a case deadline', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const helper = runCompute(caseDetailHelper, {
      state: integrationTest.getState(),
    });

    await integrationTest.runSequence('openEditCaseDeadlineModalSequence', {
      caseDeadlineId: helper.caseDeadlines[0].caseDeadlineId,
    });

    expect(integrationTest.getState('form.caseDeadlineId')).toBeTruthy();
    expect(integrationTest.getState('form.month')).toBeTruthy();
    expect(integrationTest.getState('form.day')).toBeTruthy();
    expect(integrationTest.getState('form.year')).toBeTruthy();
    expect(integrationTest.getState('form.description')).toBeTruthy();

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'description',
      value: `We're talking away
I don't know what
I'm to say I'll say it anyway
Today's another day to find you
Shying away
I'll be coming for your love, okay?

Take on me, (take on me)
Take me on, (take on me)
I'll be gone
In a day or two`,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'month',
      value: overrides.month || '4',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'day',
      value: overrides.day || '1',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'year',
      value: overrides.year || '2035',
    });

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('updateCaseDeadlineSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      description: VALIDATION_ERROR_MESSAGES.description[0].message,
    });

    await integrationTest.runSequence('validateCaseDeadlineSequence');

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'description',
      value: overrides.description || "We're talking away another day...",
    });

    await integrationTest.runSequence('validateCaseDeadlineSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('updateCaseDeadlineSequence');
  });
};
