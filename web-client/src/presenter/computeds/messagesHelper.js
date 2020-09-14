import { state } from 'cerebral';

export const messagesHelper = get => {
  const messageBoxToDisplay = get(state.messageBoxToDisplay);
  const showIndividualMessages = messageBoxToDisplay.queue === 'my';
  const showSectionMessages = messageBoxToDisplay.queue === 'section';

  const messagesInboxCount = get(state.messagesInboxCount);
  const messagesSectionCount =
    get(state.messagesSectionCount) * Math.max(1, messagesInboxCount);
  const inboxCount =
    messageBoxToDisplay.queue === 'my'
      ? messagesInboxCount
      : messagesSectionCount;

  const messagesTitle = showIndividualMessages
    ? 'My Messages'
    : 'Section Messages';

  return {
    inboxCount,
    messagesTitle,
    showIndividualMessages,
    showSectionMessages,
  };
};
