import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const messagesIndividualInboxHelper = (
  get: Get,
): {
  allMessagesSelected: boolean;
  someMessagesSelected: boolean;
  isCompletionButtonEnabled: boolean;
  allMessagesCheckboxEnabled: boolean;
  allMessagesCheckboxChecked: boolean;
  completedAtFormatted: string;
  completedBy: string;
  completionSuccess: boolean;
} => {
  const messagesInboxCount = get(state.messagesInboxCount);
  const messagesSelectedCount = get(state.messagesPage.selectedMessages).size;
  const completedBy = get(state.messagesPage.completedBy);
  const completedAtFormatted = get(state.messagesPage.completedAtFormatted);
  const completionSuccess = get(state.messagesPage.completionSuccess);

  const allMessagesSelected = messagesInboxCount === messagesSelectedCount;
  const someMessagesSelected = messagesSelectedCount > 0;
  const isCompletionButtonEnabled = someMessagesSelected;

  return {
    allMessagesCheckboxChecked: allMessagesSelected && !!messagesInboxCount,
    allMessagesCheckboxEnabled: !!messagesInboxCount,
    allMessagesSelected,
    completedAtFormatted,
    completedBy,
    completionSuccess,
    isCompletionButtonEnabled,
    someMessagesSelected,
  };
};
