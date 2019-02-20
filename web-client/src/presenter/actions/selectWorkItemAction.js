import { state } from 'cerebral';

/**
 * Either appends or removes the selected work item from the state.selectedWorkItems collection.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.props the cerebral props object used for knowing which work item was selected
 * @param {Object} providers.props.workItem the work item which was selected
 * @param {Object} providers.store the cerebral store object needed for setting the state.selectedWorkItems
 * @param {Function} providers.get the cerebral get function used for getting the state.selectedWorkItems
 * @returns {undefined} doesn't return anything
 */
export default ({ props, store, get }) => {
  const selectedWorkItems = get(state.selectedWorkItems);
  if (
    selectedWorkItems.find(
      workItem => workItem.workItemId === props.workItem.workItemId,
    )
  ) {
    store.set(
      state.selectedWorkItems,
      selectedWorkItems.filter(
        workItem => workItem.workItemId !== props.workItem.workItemId,
      ),
    );
  } else {
    store.set(state.selectedWorkItems, [...selectedWorkItems, props.workItem]);
  }
};
