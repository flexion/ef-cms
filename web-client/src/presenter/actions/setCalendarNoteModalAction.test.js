import { runAction } from 'cerebral/test';
import { setCalendarNoteModalAction } from './setCalendarNoteModalAction';

describe('setCalendarNoteModalAction', () => {
  it('sets state.modal.note to the value of props.note', async () => {
    const mockNote = 'This is an important note.';
    const { state } = await runAction(setCalendarNoteModalAction, {
      props: {
        note: mockNote,
      },
    });

    expect(state.modal.note).toEqual(mockNote);
    expect(state.modal.isEditing).toEqual(true);
  });

  it('sets state.modal.note to the value of props.note, but isEditing to false if props.note is falsy', async () => {
    const mockNote = null;
    const { state } = await runAction(setCalendarNoteModalAction, {
      props: {
        note: mockNote,
      },
    });

    expect(state.modal.note).toEqual(mockNote);
    expect(state.modal.isEditing).toEqual(false);
  });
});
