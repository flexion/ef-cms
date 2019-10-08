import { state } from 'cerebral';

/**
 * sets the state.currentTab based on the state.documentDetailHelper
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.currentTab
 * @param {Function} providers.get the cerebral get function used for getting state.documentDetailHelper
 */
export const setDefaultDocumentDetailTabAction = ({ get, store }) => {
  const { showDocumentInfoTab } = get(state.documentDetailHelper);
  store.set(
    state.currentTab,
    showDocumentInfoTab ? 'Document Info' : 'Messages',
  );
  store.unset(state.documentDetail.messagesTab);
};
