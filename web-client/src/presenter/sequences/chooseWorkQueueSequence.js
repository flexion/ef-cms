import { chooseWorkQueueAction } from '../actions/chooseWorkQueueAction';
import { clearWorkQueueAction } from '../actions/clearWorkQueueAction';
import { getSentWorkItemsForSectionAction } from '../actions/getSentWorkItemsForSectionAction';
import { getSentWorkItemsForUserAction } from '../actions/getSentWorkItemsForUserAction';
import { getWorkItemsByUserAction } from '../actions/getWorkItemsByUserAction';
import { getWorkItemsForSectionAction } from '../actions/getWorkItemsForSectionAction';
import { setWorkItemsAction } from '../actions/setWorkItemsAction';

export const chooseWorkQueueSequence = [
  clearWorkQueueAction,
  chooseWorkQueueAction,
  {
    sectioninbox: [getWorkItemsForSectionAction, setWorkItemsAction],
    sectionoutbox: [getSentWorkItemsForSectionAction, setWorkItemsAction],
    myinbox: [getWorkItemsByUserAction, setWorkItemsAction],
    myoutbox: [getSentWorkItemsForUserAction, setWorkItemsAction],
  },
];
