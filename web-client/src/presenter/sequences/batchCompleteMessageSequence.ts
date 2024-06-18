import { batchCompleteMessageAction } from '../actions/batchCompleteMessageAction';
import { getInboxMessagesForUserAction } from '@web-client/presenter/actions/getInboxMessagesForUserAction';
import { resetCacheKeyAction } from '@web-client/presenter/actions/resetCacheKeyAction';
import { setMessagesAction } from '../actions/setMessagesAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
export const batchCompleteMessageSequence = showProgressSequenceDecorator([
  batchCompleteMessageAction,
  getInboxMessagesForUserAction,
  setMessagesAction,
  resetCacheKeyAction,
]);
