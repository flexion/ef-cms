import { state } from 'cerebral';

/**
 * sets the state.showModal to display the PaperServiceConfirmModal if there are paperServiceParties on the props
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setPaperServicePartiesAction = ({ props, store }) => {
  if (
    props.paperServicePdfUrl &&
    props.paperServiceParties &&
    props.paperServiceParties.length > 0
  ) {
    store.set(state.showModal, 'PaperServiceConfirmModal');
  }
};
