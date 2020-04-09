import { state } from 'cerebral';

/**
 * sets currentViewMetadata.startCaseInternal tab to props tab
 *
 * @param {object} providers the providers object
 * @param {Function} providers.props the cerebral props object
 * @param {Function} providers.store the cerebral store object
 */
export const setStartInternalCaseTabAction = ({ props, store }) => {
  store.set(state.currentViewMetadata.startCaseInternal.tab, props.tab);
};
