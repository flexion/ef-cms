import { state } from 'cerebral';

/**
 * changes the route to path provided in state.path
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.router the riot.router object that is used for changing the route
 * @param {Function} providers.get the cerebral get function used for getting the path to navigate to in state.path
 */
export const navigateToPathAction = async ({ get, router, props }) => {
  const path = props.path || get(state.path);
  await router.route(path);
};
