import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { getTextByCount } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkEditsHearingNote = (integrationTest, updatedNote) => {
  return it('Docket Clerk updates the note on a hearing', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    let caseDetail = integrationTest.getState('caseDetail');
    caseDetail = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    let hearing = caseDetail.hearings[caseDetail.hearings.length - 1];

    await integrationTest.runSequence('openAddEditCalendarNoteModalSequence', {
      docketNumber: caseDetail.docketNumber,
      note: hearing.calendarNotes,
      trialSessionId: hearing.trialSessionId,
    });

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'note',
      value: '',
    });

    await integrationTest.runSequence('updateHearingNoteSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({
      note: 'Add a note',
    });

    const textWithCountOverLimit = getTextByCount(201);

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'note',
      value: textWithCountOverLimit,
    });

    await integrationTest.runSequence('updateHearingNoteSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({
      note: 'Limit is 200 characters. Enter 200 or fewer characters.',
    });

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'note',
      value: updatedNote,
    });

    await integrationTest.runSequence('updateHearingNoteSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});
    expect(integrationTest.getState('alertSuccess').message).toEqual(
      'Note saved.',
    );

    caseDetail = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    const updatedHearing = caseDetail.hearings.find(
      caseHearing => caseHearing.trialSessionId === hearing.trialSessionId,
    );

    expect(updatedHearing.calendarNotes).toEqual(updatedNote);
  });
};
