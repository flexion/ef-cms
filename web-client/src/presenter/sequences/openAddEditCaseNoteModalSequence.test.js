import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { openAddEditCalendarNoteModalSequence } from './openAddEditCalendarNoteModalSequence';
import { presenter } from '../presenter-mock';

describe('openAddEditCalendarNoteModalSequence', () => {
  const mockNote = 'A note.';
  let integrationTest;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      openAddEditCalendarNoteModalSequence,
    };
    integrationTest = CerebralTest(presenter);
  });

  it('should set modal.note from props.note and modal.isEditing to true', async () => {
    await integrationTest.runSequence('openAddEditCalendarNoteModalSequence', {
      note: mockNote,
    });

    expect(integrationTest.getState('modal')).toMatchObject({
      isEditing: true,
      note: mockNote,
    });
  });

  it('set modal.showModal to AddEditCalendarNoteModal', async () => {
    await integrationTest.runSequence('openAddEditCalendarNoteModalSequence', {
      note: mockNote,
    });

    expect(integrationTest.getState('modal.showModal')).toBe(
      'AddEditCalendarNoteModal',
    );
  });
});
