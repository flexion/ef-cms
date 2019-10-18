import { clearModalStateAction } from '../actions/clearModalStateAction';
import { set } from 'cerebral/factories';
import { setCreateMessageModalDialogModalStateAction } from '../actions/WorkItem/setCreateMessageModalDialogModalStateAction';
import { state } from 'cerebral';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

export const openCreateMessageAlongsideDocketRecordQCModalSequence = [
  validateDocketEntryAction,
  {
    success: [
      clearModalStateAction,
      setCreateMessageModalDialogModalStateAction,
      set(state.showModal, 'CreateMessageAlongsideDocketRecordQCModal'),
    ],
  },
];
