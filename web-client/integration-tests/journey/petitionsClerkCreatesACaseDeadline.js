import { CaseDeadline } from '../../../shared/src/business/entities/CaseDeadline';
import { refreshElasticsearchIndex } from '../helpers';

const { VALIDATION_ERROR_MESSAGES } = CaseDeadline;

export const petitionsClerkCreatesACaseDeadline = (
  integrationTest,
  overrides = {},
) => {
  return it('Petitions clerk creates a case deadline', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('openCreateCaseDeadlineModalSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('createCaseDeadlineSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      deadlineDate: VALIDATION_ERROR_MESSAGES.deadlineDate,
      description: VALIDATION_ERROR_MESSAGES.description[1],
    });

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
      value: overrides.month || '8',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'day',
      value: overrides.day || '12',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'year',
      value: overrides.year || '2025',
    });

    await integrationTest.runSequence('validateCaseDeadlineSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      description: VALIDATION_ERROR_MESSAGES.description[0].message,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'description',
      value: overrides.description || "We're talking away...",
    });

    await integrationTest.runSequence('validateCaseDeadlineSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('createCaseDeadlineSequence');

    await refreshElasticsearchIndex();
  });
};
