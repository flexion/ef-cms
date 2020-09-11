import { chooseWorkQueueAction } from '../actions/chooseWorkQueueAction';
import { clearWorkQueueAction } from '../actions/clearWorkQueueAction';
import { getDocumentQCInboxForSectionAction } from '../actions/getDocumentQCInboxForSectionAction';
import { getDocumentQCInboxForUserAction } from '../actions/getDocumentQCInboxForUserAction';
import { getDocumentQCServedForSectionAction } from '../actions/getDocumentQCServedForSectionAction';
import { getDocumentQCServedForUserAction } from '../actions/getDocumentQCServedForUserAction';
import { getJudgeForCurrentUserAction } from '../actions/getJudgeForCurrentUserAction';
import { getNotificationsAction } from '../actions/getNotificationsAction';
import { parallel } from 'cerebral/factories';
import { setJudgeUserAction } from '../actions/setJudgeUserAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';
import { setSectionInboxCountAction } from '../actions/setSectionInboxCountAction';
import { setWorkItemsAction } from '../actions/setWorkItemsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const chooseWorkQueueSequence = showProgressSequenceDecorator([
  clearWorkQueueAction,
  getJudgeForCurrentUserAction,
  setJudgeUserAction,
  parallel([
    [getNotificationsAction, setNotificationsAction],
    [
      chooseWorkQueueAction,
      {
        documentqcmyinProgress: [
          getDocumentQCInboxForUserAction,
          setWorkItemsAction,
          setSectionInboxCountAction,
        ],
        documentqcmyinbox: [
          getDocumentQCInboxForUserAction,
          setWorkItemsAction,
          setSectionInboxCountAction,
        ],
        documentqcmyoutbox: [
          getDocumentQCServedForUserAction,
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
      },
    ],
  ]),
]);
