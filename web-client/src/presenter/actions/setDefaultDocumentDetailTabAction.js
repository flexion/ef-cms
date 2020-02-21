import { state } from 'cerebral';

/**
 * sets the state.currentTab based on the state.documentDetailHelper
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setDefaultDocumentDetailTabAction = ({
  applicationContext,
  get,
  store,
}) => {
  const { STATUS_TYPES } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);
  const documentId = get(state.documentId);
  const document = caseDetail.documents.find(
    item => item.documentId === documentId,
  );

  const showDocumentInfoTab =
    document.documentType === 'Petition' &&
<<<<<<< HEAD
    [
      STATUS_TYPES.new,
      STATUS_TYPES.inProgress,
      STATUS_TYPES.batchedForIRS,
    ].includes(caseDetail.status);
=======
    [STATUS_TYPES.new, STATUS_TYPES.inProgress].includes(caseDetail.status);
>>>>>>> 7a8d384ef13385e6bac1dd386126cad50eea3d84

  store.set(
    state.currentTab,
    showDocumentInfoTab ? 'Document Info' : 'Messages',
  );
  store.unset(state.documentDetail.messagesTab);
};
