import { chooseWorkQueueAction } from '../actions/chooseWorkQueueAction';
import { clearWorkQueueAction } from '../actions/clearWorkQueueAction';
import { getDocumentQCBatchedForSectionAction } from '../actions/getDocumentQCBatchedForSectionAction';
import { getDocumentQCBatchedForUserAction } from '../actions/getDocumentQCBatchedForUserAction';
import { getDocumentQCInboxForSectionAction } from '../actions/getDocumentQCInboxForSectionAction';
import { getDocumentQCInboxForUserAction } from '../actions/getDocumentQCInboxForUserAction';
import { getDocumentQCServedForSectionAction } from '../actions/getDocumentQCServedForSectionAction';
import { getDocumentQCServedForUserAction } from '../actions/getDocumentQCServedForUserAction';
import { getInboxMessagesForSectionAction } from '../actions/getInboxMessagesForSectionAction';
import { getInboxMessagesForUserAction } from '../actions/getInboxMessagesForUserAction';
import { getSentMessagesForSectionAction } from '../actions/getSentMessagesForSectionAction';
import { getSentMessagesForUserAction } from '../actions/getSentMessagesForUserAction';
import { setSectionInboxCountAction } from '../actions/setSectionInboxCountAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { setWorkItemsAction } from '../actions/setWorkItemsAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const chooseWorkQueueSequence = [
  setWaitingForResponseAction,
  clearWorkQueueAction,
  chooseWorkQueueAction,
  {
    documentqcmybatched: [
      getDocumentQCBatchedForUserAction,
      setWorkItemsAction,
    ],
    documentqcmyinProgress: [
      getDocumentQCInboxForUserAction,
      setWorkItemsAction,
    ],
    documentqcmyinbox: [getDocumentQCInboxForUserAction, setWorkItemsAction],
    documentqcmyoutbox: [getDocumentQCServedForUserAction, setWorkItemsAction],
    documentqcsectionbatched: [
      getDocumentQCBatchedForSectionAction,
      setWorkItemsAction,
    ],
    documentqcsectioninProgress: [
      getDocumentQCInboxForSectionAction,
      setWorkItemsAction,
      setSectionInboxCountAction,
    ],
    documentqcsectioninbox: [
      getDocumentQCInboxForSectionAction,
      setWorkItemsAction,
      setSectionInboxCountAction,
    ],
    documentqcsectionoutbox: [
      getDocumentQCServedForSectionAction,
      setWorkItemsAction,
    ],
    messagesmyinbox: [getInboxMessagesForUserAction, setWorkItemsAction],
    messagesmyoutbox: [getSentMessagesForUserAction, setWorkItemsAction],
    messagessectioninbox: [
      getInboxMessagesForSectionAction,
      setWorkItemsAction,
      setSectionInboxCountAction,
    ],
    messagessectionoutbox: [
      getSentMessagesForSectionAction,
      setWorkItemsAction,
    ],
  },
  unsetWaitingForResponseAction,
];
