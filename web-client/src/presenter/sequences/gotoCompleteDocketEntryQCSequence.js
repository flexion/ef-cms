import { clearModalAction } from '../actions/clearModalAction';
import { getWorkItemAction } from '../actions/WorkItem/getWorkItemAction';
import { isWorkItemAlreadyCompletedAction } from '../actions/WorkItem/isWorkItemAlreadyCompletedAction';
import { navigateToDocketQcAction } from '../actions/navigateToDocketQcAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const gotoCompleteDocketEntryQCSequence = [
  getWorkItemAction,
  isWorkItemAlreadyCompletedAction,
  {
    no: [clearModalAction, navigateToDocketQcAction],
    yes: [setShowModalFactoryAction('WorkItemAlreadyCompletedModal')],
  },
];
