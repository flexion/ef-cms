import { createISODateString } from '../../../../shared/src/business/utilities/DateHandler';
import { formatDateIfToday } from '../computeds/formattedWorkQueue';
import { state } from '@web-client/presenter/app.cerebral';

export const batchCompleteMessageAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{ batchCompleteResult: BatchCompleteResultType }> => {
  const messages = get(state.messagesPage.selectedMessages);

  const batchCompleteResult: BatchCompleteResultType = {
    completedAtFormatted: '',
    completedBy: '',
    success: false,
  };
  // we can do this in another action if we really want to
  const messagesToComplete = Array.from(messages, ([, parentMessageId]) => ({
    messageBody: '',
    parentMessageId,
  }));

  try {
    await applicationContext
      .getUseCases()
      .completeMessageInteractor(applicationContext, {
        messages: messagesToComplete,
      });

    const now = createISODateString();

    batchCompleteResult.success = true;
    batchCompleteResult.completedBy = applicationContext.getCurrentUser().name;
    batchCompleteResult.completedAtFormatted = formatDateIfToday(
      now,
      applicationContext,
    );
  } catch (error) {
    console.error(
      'Something happened while trying to complete messages from the inbox',
      error,
    );
  }
  return { batchCompleteResult };
};

export type BatchCompleteResultType = {
  success: boolean;
  completedAtFormatted: string;
  completedBy: string;
};
