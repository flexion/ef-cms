import { runCompute } from 'cerebral/test';
import { trialSessionWorkingCopyHelper as trialSessionWorkingCopyHelperComputed } from '../../src/presenter/computeds/trialSessionWorkingCopyHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const trialSessionWorkingCopyHelper = withAppContextDecorator(
  trialSessionWorkingCopyHelperComputed,
);

export const judgeAddsNotesFromWorkingCopyCaseList = integrationTest => {
  return it('Judge adds case notes from working copy case list', async () => {
    await integrationTest.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: integrationTest.trialSessionId,
    });
    expect(integrationTest.getState('currentPage')).toEqual(
      'TrialSessionWorkingCopy',
    );

    let workingCopyHelper = runCompute(trialSessionWorkingCopyHelper, {
      state: integrationTest.getState(),
    });

    const { docketNumber } = workingCopyHelper.formattedCases[0];

    await integrationTest.runSequence(
      'openAddEditUserCaseNoteModalFromListSequence',
      {
        docketNumber,
      },
    );

    expect(integrationTest.getState('modal')).toEqual({
      caseTitle: 'Mona Schultz',
      docketNumber,
      notes: undefined,
      showModal: 'AddEditUserCaseNoteModal',
    });

    await integrationTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'modal.notes',
      value: 'this is a note added from the modal',
    });

    expect(integrationTest.getState('modal')).toEqual({
      caseTitle: 'Mona Schultz',
      docketNumber,
      notes: 'this is a note added from the modal',
      showModal: 'AddEditUserCaseNoteModal',
    });

    await integrationTest.runSequence(
      'updateUserCaseNoteOnWorkingCopySequence',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(
      integrationTest.getState(
        `trialSessionWorkingCopy.userNotes.${docketNumber}.notes`,
      ),
    ).toEqual('this is a note added from the modal');
  });
};
