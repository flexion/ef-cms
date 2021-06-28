import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkDeletesCalendarNote = integrationTest => {
  return it('Docket Clerk deletes calendar note', async () => {
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

    await integrationTest.runSequence('deleteCalendarNoteSequence');
    expect(integrationTest.getState('alertSuccess.message')).toEqual(
      'Note deleted.',
    );

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    caseDetail = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    expect(caseDetail.trialSessionNotes).toBe(null);
    integrationTest.calendarNote = null;
  });
};
