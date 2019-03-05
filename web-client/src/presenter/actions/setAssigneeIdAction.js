import { state } from 'cerebral';

/**
 * sets the state.assigneeId and state.assigneeName based on the props.assigneeId and props.assigneeName passed in.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting the state.assigneeId and state.assigneeName
 * @param {Object} providers.props the cerebral props object used for passing the props.assigneeId and props.assigneeName
 */
export const setAssigneeIdAction = ({ props, store }) => {
  store.set(state.assigneeId, props.assigneeId);
  store.set(state.assigneeName, props.assigneeName);
};
