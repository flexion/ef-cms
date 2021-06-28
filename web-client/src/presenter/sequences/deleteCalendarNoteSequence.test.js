import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { deleteCalendarNoteSequence } from './deleteCalendarNoteSequence';
import { presenter } from '../presenter-mock';

describe('deleteCalendarNoteSequence', () => {
  const mockDocketNumber = '999-99';
  const mockTrialSessionId = '4e544995-92a9-45e4-af0a-149dd9c24458';

  const caseOrderItemWithoutNote = {
    calendarNote: null,
    docketNumber: mockDocketNumber,
  };

  let integrationTest;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.sequences = {
      deleteCalendarNoteSequence,
    };
    integrationTest = CerebralTest(presenter);

    applicationContext
      .getUseCases()
      .saveCalendarNoteInteractor.mockReturnValue({
        caseOrder: [caseOrderItemWithoutNote],
        trialSessionId: mockTrialSessionId,
      });

    integrationTest.setState('caseDetail', {
      docketNumber: mockDocketNumber,
      trialSessionId: mockTrialSessionId,
    });

    integrationTest.setState('trialSessions', [
      {
        caseOrder: [{ ...caseOrderItemWithoutNote, calendarNote: 'delete me' }],
        trialSessionId: mockTrialSessionId,
      },
    ]);
  });

  it('should update state.trialSessions after deleting the note on the specified trialSession', async () => {
    await integrationTest.runSequence('deleteCalendarNoteSequence');

    expect(integrationTest.getState('trialSessions')).toEqual([
      {
        caseOrder: [{ calendarNote: null, docketNumber: mockDocketNumber }],
        trialSessionId: mockTrialSessionId,
      },
    ]);
  });
});
