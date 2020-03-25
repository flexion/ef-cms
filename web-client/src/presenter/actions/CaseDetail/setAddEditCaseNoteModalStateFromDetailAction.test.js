import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setAddEditCaseNoteModalStateFromDetailAction } from './setAddEditCaseNoteModalStateFromDetailAction';

const applicationContext = applicationContextForClient;
presenter.providers.applicationContext = applicationContext;

describe('setAddEditCaseNoteModalStateFromDetailAction', () => {
  it('should set the modal state from caseDetail', async () => {
    const result = await runAction(
      setAddEditCaseNoteModalStateFromDetailAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            caseCaption: 'Sisqo, Petitioner',
            caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            caseNote: 'i got some notes',
            docketNumber: '101-19',
            docketNumberSuffix: 'L',
          },
        },
      },
    );
    expect(result.state.modal.caseCaptionNames).toEqual('Sisqo');
    expect(result.state.modal.caseId).toEqual(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );
    expect(result.state.modal.docketNumber).toEqual('101-19L');
    expect(result.state.modal.notes).toEqual('i got some notes');
  });

  it('should set the modal state when caseCaption and docketNumberSuffix do not exist', async () => {
    const result = await runAction(
      setAddEditCaseNoteModalStateFromDetailAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            caseNote: 'i got some notes',
            docketNumber: '101-19',
          },
        },
      },
    );
    expect(result.state.modal.caseCaptionNames).toEqual('');
    expect(result.state.modal.caseId).toEqual(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );
    expect(result.state.modal.docketNumber).toEqual('101-19');
    expect(result.state.modal.notes).toEqual('i got some notes');
  });
});
