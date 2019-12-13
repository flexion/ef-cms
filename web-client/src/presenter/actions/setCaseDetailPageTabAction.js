import { state } from 'cerebral';

/**
 * Sets the caseDetailPage.primaryTab view.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting workQueueToDisplay
 * @param {object} providers.props.tab the tab to display
 */
export const setCaseDetailPageTabAction = ({ props, store }) => {
  if (props.tab) {
    store.set(state.caseDetailPage.primaryTab, props.tab);
  } else if (props.caseInformationTab) {
    store.set(state.caseDetailPage.primaryTab, 'caseInformation');
    store.set(
      state.caseDetailPage.caseInformationTab,
      props.caseInformationTab,
    );
  }
};
