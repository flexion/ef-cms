import { state } from '@web-client/presenter/app.cerebral';

/**
 * updates the current message form data's attachments field
 * @param {object} providers the providers object
 * @param {object} providers.get the get function to retrieve values from state
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const updateMessageModalAttachmentsAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const { attachments, draftAttachments } = get(state.modal.form);
  const caseDetail = get(state.caseDetail);
  const documentId = props.documentId || get(state.docketEntryId);

  if (documentId) {
    const document = applicationContext
      .getUtilities()
      .getAttachmentDocumentById({
        caseDetail,
        documentId,
      });

    const documentTitle = applicationContext
      .getUtilities()
      .getDescriptionDisplay(document);

    if (attachments.length === 0) {
      // This is the first attachment, so we should update the subject
      store.set(state.modal.form.subject, documentTitle.slice(0, 250));
    }
    if (props.action === 'add') {
      draftAttachments.push({
        documentId,
        documentTitle,
      });
    } else if (props.action === 'remove') {
      const foundIndex = draftAttachments.findIndex(
        attachment => attachment.documentId == props.documentId,
      );
      draftAttachments.splice(foundIndex, 1);
    }

    store.set(state.modal.form.draftAttachments, draftAttachments);
  }
};
