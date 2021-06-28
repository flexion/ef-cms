import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkAddEditsCalendarNote = (
  integrationTest,
  addingOrEditing,
) => {
  return it(`Docket Clerk ${addingOrEditing} calendar note`, async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    let caseDetail = integrationTest.getState('caseDetail');

    await integrationTest.runSequence('openAddEditCalendarNoteModalSequence', {
      note: caseDetail.trialSessionNotes,
    });

    expect(integrationTest.getState('modal.notes')).toEqual(
      caseDetail.trialSessionNotes,
    );

    await integrationTest.runSequence('clearModalFormSequence');

    caseDetail = integrationTest.getState('caseDetail');

    expect(integrationTest.getState('modal.notes')).toEqual(
      caseDetail.trialSessionNotes,
    );

    await integrationTest.runSequence('openAddEditCalendarNoteModalSequence', {
      note: caseDetail.trialSessionNotes,
    });

    const updatedNote = 'This is a new note';
    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'note',
      value: updatedNote,
    });

    await integrationTest.runSequence('updateCalendarNoteSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});
    expect(integrationTest.getState('alertSuccess.message')).toEqual(
      'Note saved.',
    );

    caseDetail = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    expect(caseDetail.trialSessionNotes).toEqual(updatedNote);
    integrationTest.calendarNote = caseDetail.trialSessionNotes;
  });
};
