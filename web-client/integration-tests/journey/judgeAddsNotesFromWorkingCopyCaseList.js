import { runCompute } from 'cerebral/test';
import { trialSessionWorkingCopyHelper as trialSessionWorkingCopyHelperComputed } from '../../src/presenter/computeds/trialSessionWorkingCopyHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const trialSessionWorkingCopyHelper = withAppContextDecorator(
  trialSessionWorkingCopyHelperComputed,
);

export default test => {
  return it('Judge adds case notes from working copy case list', async () => {
    await test.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: test.trialSessionId,
    });
    expect(test.getState('currentPage')).toEqual('TrialSessionWorkingCopy');

    let workingCopyHelper = runCompute(trialSessionWorkingCopyHelper, {
      state: test.getState(),
    });

    const { docketNumber } = workingCopyHelper.formattedCases[0];

    await test.runSequence('openAddEditNoteModalFromListSequence', {
      docketNumber,
    });

    expect(test.getState('modal')).toEqual({
      caseCaptionNames: 'Mona Schultz',
      docketNumber: docketNumber,
      notes: undefined,
    });

    await test.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'modal.notes',
      value: 'this is a note added from the modal',
    });

    expect(test.getState('modal')).toEqual({
      caseCaptionNames: 'Mona Schultz',
      docketNumber: docketNumber,
      notes: 'this is a note added from the modal',
    });

    await test.runSequence('updateCaseWorkingCopyNoteSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(
      test.getState(
        `trialSessionWorkingCopy.caseMetadata.${docketNumber}.notes`,
      ),
    ).toEqual('this is a note added from the modal');
  });
};
