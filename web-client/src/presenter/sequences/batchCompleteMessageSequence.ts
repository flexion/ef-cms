import { batchCompleteMessageAction } from '../actions/batchCompleteMessageAction';
import { fetchUserNotificationsSequence } from './fetchUserNotificationsSequence';
import { getInboxMessagesForUserAction } from '@web-client/presenter/actions/getInboxMessagesForUserAction';
import { resetCacheKeyAction } from '@web-client/presenter/actions/resetCacheKeyAction';
import { resetSelectedMessageAction } from '../actions/Messages/resetSelectedMessageAction';
import { setCompleteMessageAlertAction } from '../actions/Messages/setCompleteMessageAlertAction';
import { setMessageCountsAction } from '../actions/setMessageCountsAction';
import { setMessagesAction } from '../actions/setMessagesAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const batchCompleteMessageSequence = showProgressSequenceDecorator([
  batchCompleteMessageAction,
  setCompleteMessageAlertAction,
  getInboxMessagesForUserAction,
  setMessagesAction,
  fetchUserNotificationsSequence, //do we need to do all the stuff in here?
  setMessageCountsAction,
  resetCacheKeyAction,
  resetSelectedMessageAction,
]);
