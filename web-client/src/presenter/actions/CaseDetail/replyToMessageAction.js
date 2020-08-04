import { state } from 'cerebral';

/**
 * replies to the message
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} contains the alert success message and parent message ID
 */
export const replyToMessageAction = async ({ applicationContext, get }) => {
  const form = get(state.modal.form);

  const docketNumber = get(state.caseDetail.docketNumber);

  const {
    parentMessageId,
  } = await applicationContext.getUseCases().replyToMessageInteractor({
    applicationContext,
    docketNumber,
    ...form,
  });

  return {
    alertSuccess: {
      message: 'Your message has been sent.',
    },
    parentMessageId,
    viewerDocumentToDisplay: {
      documentId: form.attachments[0].documentId,
    },
  };
};
