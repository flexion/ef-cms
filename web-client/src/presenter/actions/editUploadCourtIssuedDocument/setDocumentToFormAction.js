import { state } from 'cerebral';

/**
 * sets the document to be edited from the current caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @returns {void} sets the document on state
 */
export const setDocumentToFormAction = ({
  applicationContext,
  props,
  store,
}) => {
  const { caseDetail, documentId } = props;

  const documentToSet = applicationContext
    .getUtilities()
    .getAttachmentDocumentById({
      caseDetail,
      documentId,
    });

  if (documentToSet) {
    store.set(state.form, {
      ...documentToSet,
      documentIdToEdit: documentId,
      primaryDocumentFile: true,
    });
  }
};
